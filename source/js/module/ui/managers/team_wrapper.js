const	React				= require('react'),
		TeamManager			= require('./team_manager/team_manager'),
		SetTeamsLaterBlock	= require('./set_teams_later_block/set_teams_later_block'),
		TeamName			= require('./team_name'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		classNames			= require('classnames'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		Button				= require('module/ui/button/button');

const TeamWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	listeners: [],
	propTypes: {
		handleIsSelectTeamLater:	React.PropTypes.func,
		otherTeamPlayers:			React.PropTypes.array.isRequired
	},
	componentWillMount: function () {
		const self = this;

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		self._initBinding();
		self._addListeners();
	},
	componentWillUnmount: function() {
		this.removeListeners();

		this.getDefaultBinding().clear();
	},
	componentWillReceiveProps: function(newProps) {
		if(newProps.otherTeamPlayers.length !== this.props.otherTeamPlayers.length) {
			this.setBlackList(newProps.otherTeamPlayers);
		}
	},
	removeListeners: function() {
		const binding = this.getDefaultBinding();

		this.listeners.forEach(listenerId => binding.removeListener(listenerId));

		this.listeners = [];
	},
	/*HELPERS*/
	_initBinding: function() {
		const	self = this,
				binding = self.getDefaultBinding();

		if(!binding.get('isInit')) {
			this.initTeamWrapperFilter();
			self._initRivalIndexData();
			self._initPlugObjectData();
			self._initRemovePlayersArray();
			self._initPlayerChooserBinding();
			self._initCreationModeBinding();
			self._fillPlugBinding();
			self._setPlayers(self.getBinding().players.toJS());
			self.setBlackList(this.props.otherTeamPlayers);
			binding.set('prevPlayers',			Immutable.fromJS(self.getBinding().players.toJS()));
			binding.set('isSetTeamLater',		false);
			binding.set('isTeamChanged',		false);
			binding.set('isInit',				true);
		}
	},
	initTeamWrapperFilter: function() {
		const	binding	= this.getDefaultBinding();

		const	school	= this.getBinding('schoolInfo').toJS(),
				rival	= this.getBinding('rival').toJS(),
				model	= this.getBinding('model').toJS();

		const	gender	= TeamHelper.getFilterGender(model.gender),
				ages	= model.ages,
				houseId	= TeamHelper.getEventType(model) === 'houses' ? binding.toJS('rivalId') : undefined;

		binding.set(
			`___teamManagerBinding.filter`,
			Immutable.fromJS(
				TeamHelper.getTeamManagerSearchFilter(
					school,
					ages,
					gender,
					houseId
				)
			)
		);
	},
	setBlackList: function(players) {
		const binding = this.getDefaultBinding();

		binding.set("___teamManagerBinding.blackList", Immutable.fromJS(players));
	},
	_fillPlugBinding: function() {
		const self = this;

		self._changeTeam(undefined);
	},
	_addListeners: function() {
		const self = this;

		self._addTeamIdListener();
		self._addTeamNameListener();
		self._addPlayersListener();
		self.addIsActiveListener();
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
	isActive: function() {
		return (
			typeof this.getDefaultBinding().get('isActive') === 'boolean' &&
			this.getDefaultBinding().get('isActive')
		);
	},
	/**
	 * Add listener for selected team ID
	 * @private
	 */
	_addTeamIdListener: function() {
		const self = this;

		const listenerId = self.getDefaultBinding().sub('selectedTeamId').addListener((descriptor) => {
			this.isActive() && self._changeTeam(descriptor.getCurrentValue());
		});

		this.listeners.push(listenerId);
	},
	_addTeamNameListener: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const listenerId = binding.sub('teamName.name').addListener(() => {
			if(this.isActive()) {
				// check team name only if selectedTeamId isn't undefined
				// it's equal situation when we have selected team.
				const	isTeamNameChanged	= (
						typeof self.getDefaultBinding().toJS('selectedTeamId') !== 'undefined' &&
						self.getDefaultBinding().toJS('teamName.name') !== self.getDefaultBinding().toJS('teamName.prevName')
					),
					isTeamPlayersChanged	= self.getDefaultBinding().toJS('isTeamPlayersChanged');

				self.getDefaultBinding().atomically()
					.set('isTeamNameChanged',	isTeamNameChanged)
					.set('isTeamChanged',		isTeamNameChanged || isTeamPlayersChanged)
					.commit();
			}
		});

		this.listeners.push(listenerId);
	},
	addIsActiveListener: function() {
		const binding = this.getDefaultBinding();

		const listenerId = binding.sub('isActive').addListener(eventDescriptor => {
			if(
				typeof eventDescriptor.getCurrentValue() === 'boolean' &&
				!eventDescriptor.getCurrentValue()
			) {
				this.removeListeners();

				this.callTeamManagerToRemoveListeners();
			}
		});

		this.listeners.push(listenerId);
	},
	_addPlayersListener: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const listenerId = binding.sub('___teamManagerBinding.teamStudents').addListener(() => {
			if(this.isActive()) {
				const	isTeamPlayersChanged	= (
						typeof binding.toJS('selectedTeamId') !== 'undefined' &&
						!Immutable.is(self._getPlayers(), binding.get('prevPlayers'))
					),
					isTeamNameChanged		= binding.toJS('isTeamNameChanged');

				binding.atomically()
					.set('isTeamPlayersChanged',	isTeamPlayersChanged)
					.set('isTeamChanged',			isTeamPlayersChanged || isTeamNameChanged)
					.commit();
			}
		});

		this.listeners.push(listenerId);
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

			binding.set('isLoadingTeam', true);

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
						.set('___teamManagerBinding.isNeedSearch',	true)
						.set('isLoadingTeam',						false)
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

		return window.Server.team.get( { schoolId: self.activeSchoolId, teamId: teamId } );
	},
	getTeamManagerBinding: function() {
		const	self = this,
				binding = self.getDefaultBinding();

		return ({
			default	: binding.sub("___teamManagerBinding"),
			error	: this.getBinding('error')
		});
	},
	_onRemovePlayer: function(player) {
		const self = this;

		self.getDefaultBinding().set('removedPlayers', Immutable.fromJS(
			self.getDefaultBinding().get('removedPlayers').push(player)
		));
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

		// ORDER IS IMPORTANT!!!
		// 1) set players
		// 2) set isNeedSearch flag
		self._setPlayers(binding.get('prevPlayers'));
		binding
			.atomically()
			.set(
				'teamName.name',
				Immutable.fromJS(binding.toJS('prevTeamName'))
			)
			.set(
				'___teamManagerBinding.isNeedSearch',
				Immutable.fromJS(true)
			)
			.commit();
	},
	callTeamManagerToRemoveListeners: function() {
		this.getDefaultBinding().set('___teamManagerBinding.isActive', false);
	},
	handleChangeName: function(newName) {
		this.getDefaultBinding().set('teamName.name', Immutable.fromJS(newName));
	},
	isShowRevertChangesButton: function() {
		const binding = this.getDefaultBinding();

		// show button if isSetTeamLater === false and team was selected and team was changed(name or players)
		return !!(
			!this.isSetTeamLater() &&
			typeof binding.toJS('selectedTeamId') !== 'undefined' &&
			binding.toJS('isTeamChanged')
		);
	},
	renderTeamNameComponent: function() {
		const event = this.getBinding('model').toJS();

		switch (true) {
			case TeamHelper.isNonTeamSport(event):
				return null;
			case TeamHelper.isTeamSport(event):
				const errorData = typeof this.getBinding('error') !== 'undefined' ? this.getBinding('error').toJS() : {};

				const isError = errorData.isError && errorData.text === "Please enter team name";

				return (
					<TeamName
						name				= { this.getDefaultBinding().toJS('teamName.name') }
						handleChangeName	= { this.handleChangeName }
						isShowError			= { isError }
					/>
				);
		}
	},
	getRevertButtonStyle: function() {
		return classNames({
			bButton		: true,
			mRevert		: true,
			mDisable	: !this.isShowRevertChangesButton()
		});
	},
	isSetTeamLater: function() {
		return this.getDefaultBinding().toJS('isSetTeamLater');
	},
	render: function() {
		const event = this.getBinding('model').toJS();

		const plugClass = classNames({
			eTeamWrapper_plug:	true,
			mDisabled:			!this.isSetTeamLater()
		});

		return (
			<div className="bTeamWrapper mMarginTop">
				<SetTeamsLaterBlock
					binding					=	{ this.getDefaultBinding() }
					event					=	{ event }
					handleIsSelectTeamLater	=	{ this.props.handleIsSelectTeamLater }
				/>
				<div className={plugClass}>
				</div>
				{ this.renderTeamNameComponent() }
				<TeamManager	isNonTeamSport	= {TeamHelper.isNonTeamSport(event)}
								binding			= {this.getTeamManagerBinding()}
				/>
				<div className="eTeamWrapper_footer">
					<Button
						text				= {'Revert changes'}
						extraStyleClasses	= {this.getRevertButtonStyle()}
						onClick				= {this._onRevertChangesButtonClick}
						isDisabled			= {!this.isShowRevertChangesButton()}
					/>
				</div>
			</div>
		);
	}
});

module.exports = TeamWrapper;