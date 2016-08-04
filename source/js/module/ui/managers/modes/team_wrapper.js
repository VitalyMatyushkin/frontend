const	React			= require('react'),
		Team			= require('./../team/skypeStyleTeam'),
		PlayerChooser	= require('./../player_chooser'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
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

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self)

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
			self._initTeamSaveMode();
			self._initPlayerChooserBinding();
			self._initCreationModeBinding();
			self._fillPlugBinding();
			binding.set('isInit', Immutable.fromJS(true));
		}
	},
	_fillPlugBinding: function() {
		const self = this;

		self._changeTeam(undefined);
	},
	_addListeners: function() {
		const self = this;

		self._addTeamIdListener();
		self._addPlayersListener();
		self._addTeamsSaveModeListener();
		self._addCreationModeListener();
	},
	_initCreationModeBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('creationMode', Immutable.fromJS(undefined));
	},
	_setCreationMode: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		switch (true) {
			case binding.toJS('selectedTeamId') !== undefined:
				binding.set('creationMode', Immutable.fromJS(self.CREATION_MODE.BASED_ON_CREATED_TEAM));
				break;
			case binding.toJS('selectedTeamId') === undefined && self._getPlayers().length !== 0:
				binding.set('creationMode', Immutable.fromJS(self.CREATION_MODE.NEW_TEAM));
				break;
			case binding.toJS('selectedTeamId') === undefined && self._getPlayers().length === 0:
				binding.set('creationMode', Immutable.fromJS(undefined));
				break;
		}
	},
	_addPlayersListener: function() {
		const self = this;

		self.playersListener = self._getPlayersBinding().addListener(descriptor => {
			if(descriptor.getCurrentValue() !== undefined && descriptor.getPreviousValue() !== undefined) {
				const	currPlayers	= descriptor.getCurrentValue().toJS(),
						prevPlayers	= descriptor.getPreviousValue().toJS();

				if(currPlayers.length > prevPlayers.length) {
					self._checkRemovedPlayersCache(
						currPlayers[currPlayers.length - 1]
					);
				}

				self._setCreationMode();
			}

			if(!self._isPlayersChanged()) {
				self._setTeamSaveMode('current');
			}
		});
	},
	_addTeamsSaveModeListener: function() {
		const	self	= this;

		self.getDefaultBinding().sub('creationMode').addListener((descriptor) => {
			const currCreationMode = descriptor.getCurrentValue();

			switch (currCreationMode) {
				case self.CREATION_MODE.NEW_TEAM:
					self._setTeamSaveMode('temp');
					break;
				case self.CREATION_MODE.BASED_ON_CREATED_TEAM:
					self._setTeamSaveMode('selectedTeam');
					break;
			}

		});
	},
	_addCreationModeListener: function() {
		const	self	= this;

		self.getDefaultBinding().sub('teamsSaveMode').addListener(() => self._setActualTeamNameMode());
	},
	_checkRemovedPlayersCache: function(player) {
		const self = this,
			removedPlayers = self.getDefaultBinding().toJS('removedPlayers');

		let findedRemovedPlayer = Lazy(removedPlayers).findWhere({id: player.id});
		if(findedRemovedPlayer) {
			let players = self._getPlayers();
			players[players.length - 1] = findedRemovedPlayer;
			self._getPlayersBinding().withDisabledListener(self.playersListener, () => {
				self.getDefaultBinding().set('players', Immutable.fromJS(players));

				const index = Lazy(removedPlayers).indexOf(findedRemovedPlayer);
				removedPlayers.splice(index, 1);
				self.getDefaultBinding().set('removedPlayers', Immutable.fromJS(removedPlayers));
			});
		}
	},
	_initPlayerChooserBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('playerChooser', Immutable.fromJS({
			filter: binding.toJS('filter')
		}));
	},
	_getPlayerChooserFilter: function(team, school) {
		return {
			gender:		team.gender,
			houseId:	team.houseId,
			schoolId:	school.id,
			forms:		TeamHelper.getFilteredAgesBySchoolForms(team.ages, school.forms)
		};
	},
	_initTeamSaveMode: function() {
		const self = this;

		self._setTeamSaveMode('selectedTeam');
	},
	_setActualTeamNameMode: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				creationMode	= binding.get('creationMode'),
				saveTeamMode	= binding.get('teamsSaveMode');
		let		teamNameMode;

		switch (true) {
			case creationMode === self.CREATION_MODE.NEW_TEAM:
				teamNameMode = 'edit';
				break;
			case creationMode === self.CREATION_MODE.BASED_ON_CREATED_TEAM && saveTeamMode === 'temp':
				teamNameMode = 'edit';
				break;
			case creationMode === self.CREATION_MODE.BASED_ON_CREATED_TEAM && saveTeamMode === 'new':
				teamNameMode = 'edit';
				break;
			case creationMode === self.CREATION_MODE.BASED_ON_CREATED_TEAM && saveTeamMode === 'current':
				teamNameMode = 'show';
				break;
			default:
				teamNameMode = 'show';
				break;
		}

		binding.set('teamName.mode', Immutable.fromJS(teamNameMode));
	},
	_setTeamSaveMode: function(mode) {
		const	self	= this;

		self.getDefaultBinding().set('teamsSaveMode', Immutable.fromJS(mode));
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
			self._setCreationMode();
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
						.set('teamTable.model.players',	Immutable.fromJS(updatedPlayers))
						.set('teamTable.model.ages',	Immutable.fromJS(team.ages))
						.set('teamTable.schoolInfo',	Immutable.fromJS(schoolData))
						.set('prevPlayers',				Immutable.fromJS(updatedPlayers))
						.set('removedPlayers',			Immutable.fromJS([]))
						.set('playerChooser.filter',	Immutable.fromJS(self._getPlayerChooserFilter(team, schoolData)))
						.commit();

					self._setPlayers(updatedPlayers);

					return team;
				});
		} else {
			binding
				.atomically()
				.set('teamTable',				Immutable.fromJS(self._getDefTeamTableObject()))
				.set('prevPlayers',				Immutable.fromJS([]))
				.set('removedPlayers',			Immutable.fromJS([]))
				.set('playerChooser.filter',	Immutable.fromJS(binding.toJS('filter')))
				.commit();

			self._setPlayers([]);
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
				playersBinding	= self.getBinding('players');

		playersBinding.set(Immutable.fromJS(players));
	},
	_getPlayers: function() {
		const	self			= this,
				playersBinding	= self.getBinding('players');

		return playersBinding.toJS();
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
	_getTeamBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return {
			default:	binding.sub('teamTable'),
			teamName:	binding.sub('teamName'),
			rivalId:	binding.sub('rival.id'),
			players:	self._getPlayersBinding()
		};
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
	_renderTypeRadioButtons: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			mode = binding.toJS('teamsSaveMode');

		return (
			<div className="eTeamWrapper_modeContainer">
				<div className="eTeamWrapper_revertButtonContainer">
					<div className="bButton mRevert" onClick={self._onRevertChangesButtonClick}>
						{'Revert changes'}
					</div>
				</div>
				<div className="eTeamWrapper_modeRadioButton">
					<div className="eTeamWrapper_modeRadioButtonInput">
						<input
							checked={mode == 'temp'}
							type="radio"
							onClick={self._onClickTypeRadioButton.bind(self, 'temp')}
						/>
					</div>
					<div className="eTeamWrapper_modeRadioButtonIText">
						Save as temp team
					</div>
				</div>
				<div className="eTeamWrapper_modeRadioButton">
					<div className="eTeamWrapper_modeRadioButtonInput">
						<input
							type="radio"
							checked={mode == 'new'}
							onClick={self._onClickTypeRadioButton.bind(self, 'new')}
						/>
					</div>
					<div className="eTeamWrapper_modeRadioButtonIText">
						Save as new team
					</div>
				</div>
				<If condition={self._isShowSelectedToCurrentTeamRadioButton()}>
					<div className="eTeamWrapper_modeRadioButton">
						<div className="eTeamWrapper_modeRadioButtonInput">
							<input
								type="radio"
								checked={mode == 'current'}
								onClick={self._onClickTypeRadioButton.bind(self, 'current')}
							/>
						</div>
						<div className="eTeamWrapper_modeRadioButtonIText">
							Save to selected team
						</div>
					</div>
				</If>
			</div>
		);
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
				binding.get('prevTeamName')
			);

		self._setPlayers(binding.get('prevPlayers'));
	},
	_onClickTypeRadioButton: function(mode) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		if(mode === 'current') {
			binding.set('teamName.name', binding.get('prevTeamName'));
		}
		self._setTeamSaveMode(mode);
	},
	_isPlayersChanged: function() {
		const self = this;

		return !Immutable.is(self._getPlayers(), self.getDefaultBinding().get('prevPlayers'));
	},
	_isShowTypeRadioButtons: function() {
		const self = this;

		return self._isPlayersChanged();
	},
	render: function() {
		const self = this,
			teamBinding = self._getTeamBinding(),
			playerChooserBinding = self._getPlayerChooserBinding();

		return (
			<div className="bTeamWrapper mMarginTop">
				<Team onRemovePlayer={self._onRemovePlayer} binding={teamBinding}/>
				<PlayerChooser binding={playerChooserBinding}/>
				<div>
					<If condition={self._isShowTypeRadioButtons()}>
						{self._renderTypeRadioButtons()}
					</If>
				</div>
			</div>

		);
	}
});

module.exports = TeamWrapper;