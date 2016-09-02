const	React			= require('react'),
		TeamManager		= require('./../team_manager/team_manager'),
		TeamName		= require('./../team_name'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		classNames		= require('classnames'),
		Lazy			= require('lazy.js'),
		If				= require('module/ui/if/if'),
		Morearty        = require('morearty'),
		Immutable		= require('immutable');

const TeamWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	playersListener: undefined,
	CREATION_MODE: {
		NEW_TEAM:				'newTeam',
		BASED_ON_CREATED_TEAM:	'basedOnCreatedTeam'
	},
	componentWillMount: function () {
		const self = this;

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		self._initBinding();
		self._addListeners();
	},

	/*HELPERS*/
	_initBinding: function() {
		const	self = this,
				binding = self.getDefaultBinding();

		if(!binding.get('isInit')) {
			self._initRivalIndexData();
			self._initPlugObjectData();
			self._initRemovePlayersArray();
			self._initPlayerChooserBinding();
			self._initCreationModeBinding();
			self._fillPlugBinding();
			self._setPlayers(self.getBinding().players.toJS());
			self._setBlackList(self.getBinding().otherTeamPlayers.toJS());
			binding.set('prevPlayers',		Immutable.fromJS(self.getBinding().players.toJS()));
			binding.set('isSetTeamLater',	Immutable.fromJS(false));
			binding.set('isInit',			Immutable.fromJS(true));
		}
	},
	_setBlackList: function(players) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set("___teamManagerBinding.blackList", Immutable.fromJS(players));
	},
	_fillPlugBinding: function() {
		const self = this;

		self._changeTeam(undefined);
	},
	_addListeners: function() {
		const self = this;

		self._addTeamIdListener();
	},
	_initCreationModeBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('creationMode', Immutable.fromJS(undefined));
	},
	_initPlayerChooserBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('playerChooser', Immutable.fromJS({
			filter: binding.toJS('filter')
		}));
	},
	/**
	 * Init removed players array.
	 * Removed players is a array for players that was deleted from team.
	 * Main idea of this - create cache array for removed players, in case removed player be return back to team.
	 * Because removed player - it's player in team and we should save his id and other data if there is the above.
	 * @private
	 */
	_initRemovePlayersArray: function() {
		const self = this,
			binding = self.getDefaultBinding();

		binding.set('removedPlayers', Immutable.fromJS([]));
	},
	/**
	 * Init selected rival index for autocompleteTeam binding
	 * In this context(TeamWrapper) we plug this object
	 * Need fix autocompleteTeam in future
	 * @private
	 */
	_initRivalIndexData: function() {
		const self = this,
			binding = self.getDefaultBinding();

		binding.set('selectedRivalIndex', Immutable.fromJS(0));
	},
	/**
	 * Init plug object for team and autocomplete team elements
	 * @private
	 */
	_initPlugObjectData: function() {
		const self = this,
			binding = self.getDefaultBinding();

		binding.set('teamTable', Immutable.fromJS(self._getDefTeamTableObject()));
	},
	_getDefTeamTableObject: function() {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				model		= self.getBinding('model').toJS(),
				houseId		= binding.get('rival.id');

		//set type to houses if rival isn't empty
		//it means - house vs house event
		//and rival is house
		//in other cases rival is empty
		let type = '';
		if(houseId) {
			type = 'houses';
		}

	   return {
			schoolInfo: {},
			players: [],
			model: {
				type:		type,
				ages:		undefined,
				gender:		model ? model.gender : undefined,
				sportModel:	model ? model.sportModel : {}
			}
	   };
	},
	/**
	 * Add listener for selected team ID
	 * @private
	 */
	_addTeamIdListener: function() {
		const self = this;

		self.getDefaultBinding().sub('selectedTeamId').addListener((descriptor) => {
			self._changeTeam(descriptor.getCurrentValue());
		});
	},
	/**
	 * Change team, that mean:
	 * 1)Get team from server.
	 * 2)Get new team players.
	 * 3)Set new data to binding.
	 * These data need for Team and AutocompleteTeam elements.
	 * @private
	 */
	_changeTeam: function(teamId) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		if(teamId) {
			let	schoolData,
				players,
				team;

			// TODO refactor
			window.Server.school.get(self.activeSchoolId)
				.then( _schoolData => {
					schoolData = _schoolData;

					// get forms data. they will inject to school
					return window.Server.schoolForms.get(self.activeSchoolId, {filter:{limit:1000}});
				})
				.then( formsData => {
					schoolData.forms = formsData;

					return self._getPlayersFromServer(teamId);
				})
				.then((_players) => {
					players = _players;

					return self._getTeamFromServer(teamId);
				})
				.then((_team) => {
					team = _team;

					return window.Server.teamPlayers.get(
						{
							schoolId:	team.schoolId,
							teamId:		team.id
						},
						{
							filter: {
								limit: 100
							}
						}
					)
				})
				.then(users => {
					let updatedPlayers = users;

					binding
						.atomically()
						.set('teamTable.model.players',				Immutable.fromJS(updatedPlayers))
						.set('teamTable.model.ages',				Immutable.fromJS(team.ages))
						.set('teamTable.schoolInfo',				Immutable.fromJS(schoolData))
						.set('prevPlayers',							Immutable.fromJS(updatedPlayers))
						.set('removedPlayers',						Immutable.fromJS([]))
						.set('___teamManagerBinding.teamStudents',	Immutable.fromJS(updatedPlayers))
						.set('___teamManagerBinding.blackList',		Immutable.fromJS(updatedPlayers))
						.commit();

					return team;
				});
		} else {
			binding
				.atomically()
				.set('teamTable',							Immutable.fromJS(self._getDefTeamTableObject()))
				.set('prevPlayers',							Immutable.fromJS([]))
				.set('removedPlayers',						Immutable.fromJS([]))
				.set('___teamManagerBinding.teamStudents',	Immutable.fromJS([]))
				.set('___teamManagerBinding.blackList',		Immutable.fromJS([]))
				.commit();
		}
	},
	/**
	 * Get user id array from team.
	 * @param team
	 * @returns {*}
	 * @private
	 */
	_getUsersIdsFromTeam: function(team) {
		return team.players.map(p => p.userId);
	},
	_setPlayers: function(players) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set("___teamManagerBinding.teamStudents", Immutable.fromJS(players));
	},
	_getPlayers: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.get("___teamManagerBinding.teamStudents");
	},
	_getPlayersBinding: function() {
		const self= this;

		return self.getBinding('players');
	},
	/**
	 * Get team players from server by team ID
	 * @param teamId - team ID
	 * @returns {Promise}
	 * @private
	 */
	_getPlayersFromServer: function(teamId) {
		const self = this;

		return window.Server.teamPlayers.get({
			schoolId:	self.activeSchoolId,
			teamId:		teamId
		});
	},
	/**
	 * Get team from server by team ID
	 * @param teamId - team ID
	 * @returns {Promise}
	 * @private
	 */
	_getTeamFromServer: function(teamId) {
		const self = this;
		// TODO Don't forget about filter when API will support includes
		//filter: {
		//	include: [
		//		{'players': ['user', 'form']},
		//		{'school': ['forms']},
		//		'sport'
		//	]
		//}
		return window.Server.team.get( { schoolId: self.activeSchoolId, teamId: teamId } );
	},
	_getPlayerChooserBinding: function() {
		const	self = this,
				binding = self.getDefaultBinding();

		return {
			default:			binding.sub('playerChooser'),
			otherTeamPlayers:	self.getBinding('otherTeamPlayers'),
			teamPlayers:		self._getPlayersBinding(),
			filter:				binding.sub('playerChooser.filter')
		};
	},
	_onRemovePlayer: function(player) {
		const self = this;

		self.getDefaultBinding().set('removedPlayers', Immutable.fromJS(
			self.getDefaultBinding().get('removedPlayers').push(player)
		));
	},
	_isShowSelectedToCurrentTeamRadioButton: function() {
		const	self	= this;

		return self.getDefaultBinding().get('creationMode') === self.CREATION_MODE.BASED_ON_CREATED_TEAM;
	},
	_isShowNewTeamNameInput: function() {
		const	self			= this,
				teamsSaveMode	= self.getDefaultBinding().toJS('teamsSaveMode');

		return teamsSaveMode == 'new' || teamsSaveMode == 'temp';
	},
	/**
	 * Handler for click to revert changes button
	 * Set initial state of selected team as current
	 * @private
	 */
	_onRevertChangesButtonClick: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set(
				'teamName.name',
				Immutable.fromJS(binding.toJS('prevTeamName'))
			);

		self._setPlayers(binding.get('prevPlayers'));
	},
	handleChangeName: function(binding, newName) {
		binding
			.atomically()
			.set('teamName.name',		Immutable.fromJS(newName))
			.set('teamName.prevName',	Immutable.fromJS(binding.toJS('teamName.name')))
			.commit();
	},
	isPlayersChanged: function() {
		const self = this;

		return !Immutable.is(self._getPlayers(), self.getDefaultBinding().get('prevPlayers'));
	},
	isShowRevertChangesButton: function() {
		const self = this;

		return self.isPlayersChanged();
	},
	renderTeamNameComponent: function(eventModel, teamName, binding) {
		const self = this;

		switch (true) {
			case TeamHelper.isNonTeamSport(eventModel):
				return null;
			case TeamHelper.isTeamSport(eventModel):
				return (
					<TeamName	name={teamName}
								handleChangeName={self.handleChangeName.bind(self, binding)}
					/>
				);
		}
	},
	isSetTeamLater: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.toJS('isSetTeamLater');
	},
	changeIsSetTeamLater: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.set('isSetTeamLater', Immutable.fromJS(!binding.toJS('isSetTeamLater')));
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = self.getBinding('model').toJS();

		const plugClass = classNames({
			eTeamWrapper_plug:	true,
			mDisabled:			!self.isSetTeamLater()
		});

		return (
			<div className="bTeamWrapper mMarginTop">
				<div className="eManager_group">
					<div className="eManager_label">{'Select Team Later'}</div>
					<div className="eManager_radiogroup">
						<input	onChange={self.changeIsSetTeamLater}
								checked={self.isSetTeamLater()}
								type="checkbox"
						/>
					</div>
				</div>
				<div className={plugClass}>
				</div>
				{
					self.renderTeamNameComponent(
						event,
						binding.toJS('teamName.name'),
						binding
					)
				}
				<TeamManager	isNonTeamSport={TeamHelper.isNonTeamSport(event)}
								binding={binding.sub("___teamManagerBinding")}
				/>
				<If condition={self.isShowRevertChangesButton()}>
					<div className="eTeamWrapper_modeContainer">
						<div className="eTeamWrapper_revertButtonContainer">
							<div className="bButton mRevert" onClick={self._onRevertChangesButtonClick}>
								{'Revert changes'}
							</div>
						</div>
					</div>
				</If>
			</div>
		);
	}
});

module.exports = TeamWrapper;