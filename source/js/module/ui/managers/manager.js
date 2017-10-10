// Main components
const	React					= require('react'),
		Morearty				= require('morearty'),
		Immutable				= require('immutable'),
		propz					= require('propz');

// Manager react components
const	TeamBundle				= require('./team_bundle'),
		RivalChooser			= require('./rival_chooser/rival_chooser'),
		GameField				= require('./gameField');

// Models
const	Error					= require('module/ui/managers/models/error'),
		InterSchoolsRivalModel	= require('module/ui/managers/rival_chooser/models/inter_schools_rival_model'),
		InternalRivalModel		= require('module/ui/managers/rival_chooser/models/internal_rival_model');

// Helpers
const	TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		EventHelper				= require('./../../helpers/eventHelper'),
		TeamPlayersValidator	= require('./helpers/team_players_validator');

// Consts
const	ManagerConsts			= require('./helpers/manager_consts');

// Manager styles
const	TeamsManagerStyles		= require('../../../../styles/ui/teams_manager/b_teams_manager.scss'),
		TeamChooserStyles		= require('../../../../styles/ui/teams_manager/b_rival_chooser.scss');

const Manager = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId			: React.PropTypes.string.isRequired,
		isShowRivals			: React.PropTypes.bool,
		isInviteMode			: React.PropTypes.bool,
		isCopyMode				: React.PropTypes.bool,
		isShowAddTeamButton		: React.PropTypes.bool,
		indexOfDisplayingRival	: React.PropTypes.number,
		selectedRivalIndex		: React.PropTypes.number
	},
	listeners: [],
	teamWrapperListeners: [],
	componentWillMount: function () {
		this.initDefaultBinding();
		this.initErrorBinding();
		this.addListeners();

		const	binding		= this.getDefaultBinding(),
				teamWrapper	= binding.toJS('teamModeView.teamWrapper');

		teamWrapper.forEach(tw => this.validate(tw.rivalId));
	},
	componentWillUnmount: function() {
		const binding = this.getDefaultBinding();

		this.listeners.forEach(l => binding.removeListener(l));
		this.removeAllTeamWrapperListeners();
	},
	getActiveSchool: function() {
		return this.getDefaultBinding().toJS('schoolInfo');
	},
	removeAllTeamWrapperListeners: function() {
		const binding = this.getDefaultBinding();

		this.teamWrapperListeners.forEach(teamWrapperListener => binding.removeListener(teamWrapperListener.listener));
		this.teamWrapperListeners = [];
	},
	removeTeamWrapperListenersByRivaId: function(rivalId) {
		const binding = this.getDefaultBinding();

		const tempTeamWrapperListeners = Object.assign(this.teamWrapperListeners);
		tempTeamWrapperListeners.forEach((teamWrapperListener, index) => {
			if(teamWrapperListener.rivalId === rivalId) {
				binding.removeListener(
					teamWrapperListener.listener
				);
				this.teamWrapperListeners.splice(index, 1);
			}
		});
	},
	getDefaultProps: function(){
		return {
			isShowAddTeamButton: false
		};
	},
	initDefaultBinding: function() {
		const	defaultBinding		= this.getDefaultBinding();

		// Init rival index if need
		const	selectedRivalIndex	= typeof this.props.selectedRivalIndex !== 'undefined' ? this.props.selectedRivalIndex : this.initRivalIndex(),
				teamTable			= this.getTeamTables(),
				teamWrapper			= this.getTeamWrappers();

		defaultBinding
			.atomically()
			.set('isSync', true)
			.set('teamModeView', Immutable.fromJS(
				{
					selectedRivalIndex:	selectedRivalIndex,
					teamTable:			teamTable,
					teamWrapper:		teamWrapper
				}
			))
			.commit();
	},
	initErrorBinding: function() {
		const rivals = this.getBinding('rivals').toJS();

		const error = rivals.map(rival => this.createErrorObjectByRival(rival));

		this.getBinding('error').set(Immutable.fromJS(error));
	},
	createErrorObjectByRival: function(rival) {
		return new Error(rival.id, '', false);
	},
	getTeamWrappers: function() {
		const binding = this.getBinding();

		const rivals = binding.rivals.toJS();

		return rivals.map((rival, rivalIndex) => this.getTeamWrapperByRivalIndex(rivalIndex));
	},
	getTeamWrapperByRivalIndex: function(rivalIndex) {
		const	defaultBinding	= this.getDefaultBinding();

		const	rivals			= this.getBinding().rivals.toJS(),
				currentRival	= rivals[rivalIndex];

		const	teamId			= this.getTeamIdByOrder(rivalIndex),
				team			= this.getTeamByOrder(rivalIndex),
				teamType		= propz.get(team, ['teamType']),
				teamName		= this.getTeamNameByOrder(rivalIndex);

		// get school id
		// TODO It's temporary
		let	schoolId;
		if(
			EventHelper.isHousesEvent(
				this.getDefaultBinding().toJS('model')
			)
		) {
			schoolId = this.getActiveSchool().id;
		} else {
			schoolId = currentRival.school.id
		}

		const teamStudents = this.getInitPlayersByOrder(rivalIndex);
		const selectedTeamId = !!this.props.isCopyMode ? undefined : teamId;

		return {
			rivalId: currentRival.id,
			savingChangesMode: ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES,
			isSetTeamLater: false,
			isTeamChanged: false,
			// team wrapper from active school is active
			// team wrapper from other school is not active by default
			isActive: schoolId === this.props.activeSchoolId,
			isLoadingTeam: false,
			schoolId: schoolId,
			prevTeamName: teamName,
			prevSelectedTeamId: selectedTeamId,
			selectedTeamId: selectedTeamId,
			teamsSaveMode: undefined,
			removedPlayers: [],
			prevPlayers: teamStudents,
			teamName: {
				initName:	teamName,
				name:		teamName
			},
			___teamManagerBinding: {
				teamStudents:	teamStudents,
				blackList:		[],
				positions:		defaultBinding.get('model.sportModel.field.positions')
			}
		};
	},
	getTeamTables: function() {
		const	self			= this,
				binding			= self.getBinding();

		const rivals = binding.rivals.toJS();

		return rivals.map((rival, rivalIndex) => this.getTeamTableByRivalIndex(rivalIndex));
	},
	getTeamTableByRivalIndex: function(rivalIndex) {
		const teamId = this.getTeamIdByOrder(rivalIndex);

		const	rivals			= this.getBinding().rivals.toJS(),
				currentRival	= rivals[rivalIndex];

		return {
			rivalId			: currentRival.id,
			selectedTeamId	: teamId,
			isSelectedTeam	: typeof team !== 'undefined',
			teamIdBlackList	: this.getTeamIdBlackListByRivalIndex(rivalIndex)
		};
	},
	getTeamIdBlackListByRivalIndex: function(rivalIndex) {
		const teamId = this.getTeamIdByOrder(rivalIndex);

		let teamIdBlackList = [];
		if(typeof teamId !== 'undefined') {
			const rivals = this.getBinding().rivals.toJS();

			teamIdBlackList = rivals
				.filter(r => typeof r.team !== 'undefined')
				.filter(r => r.team.id !== teamId)
				.map(r => r.id);
		}

		return teamIdBlackList;
	},
	getInitPlayersByOrder: function(order) {
		const binding = this.getBinding();

		let players = [];

		if(typeof binding.rivals !== "undefined") {
			const rivals = binding.rivals.toJS();
			const _players = propz.get(rivals, [order, 'players']);
			if(typeof _players !== "undefined") {
				players = _players;
			}
		}

		return players;
	},
	getTeamNameByOrder: function(order) {
		const binding = this.getBinding();

		let teamName;

		if(typeof binding.rivals !== "undefined") {
			const rivals = binding.rivals.toJS();
			teamName = propz.get(rivals, [order, 'team', 'name']);
		}

		return teamName;
	},
	getTeamIdByOrder: function(order) {
		const binding = this.getBinding();

		let teamId;

		if(typeof binding.rivals !== "undefined") {
			const rivals = binding.rivals.toJS();
			teamId = propz.get(rivals, [order, 'team', 'id']);
		}

		return teamId;
	},
	getTeamByOrder: function(order) {
		const binding = this.getBinding();

		let team;

		if(typeof binding.rivals !== "undefined") {
			const rivals = binding.rivals.toJS();
			team = propz.get(rivals, [order, 'team']);
		}

		return team;
	},
	getTeamTypeByOrder: function(order) {
		const	binding	= this.getBinding();

		let teamType;

		if(typeof binding.rivals !== "undefined") {
			const rivals = binding.rivals.toJS();
			teamType = propz.get(rivals, [order, 'team', 'teamType']);
		}

		return teamType;
	},
	addListeners: function() {
		const	binding		= this.getDefaultBinding(),
				teamWrapper	= binding.toJS('teamModeView.teamWrapper');

		this.addTeamWrapperListeners();
	},
	addTeamWrapperListeners: function() {
		const	binding		= this.getDefaultBinding(),
				teamWrapper	= binding.toJS('teamModeView.teamWrapper');

		teamWrapper.forEach(tw => this.addTeamWrapperListenersByRivalId(tw.rivalId));
	},
	addTeamWrapperListenersByRivalId: function(rivalId) {
		const	binding			= this.getDefaultBinding();

		const	teamWrappers		= binding.toJS(`teamModeView.teamWrapper`),
				event				= this.getDefaultBinding().toJS('model'),
				rivalIndex			= this.getBinding('rivals').toJS().findIndex(r => r.id === rivalId),
				teamWrapperIndex	= teamWrappers.findIndex(tw => tw.rivalId === rivalId);

		if(
			// for index 0 always true
		rivalIndex === 0 ||
		(
			rivalIndex > 0 &&
			// condition for other indexes
			(
				!EventHelper.isEventWithOneIndividualTeam(event) || TeamHelper.isOneOnOneSport(event)
			)
		)
		) {
			this.teamWrapperListeners.push(
				{
					rivalId:	rivalId,
					listener:	binding.sub(`teamModeView.teamWrapper.${teamWrapperIndex}.___teamManagerBinding.teamStudents`).addListener(() => this.validate(rivalId))
				}
			);

			this.teamWrapperListeners.push(
				{
					rivalId:	rivalId,
					listener:	binding.sub(`teamModeView.teamWrapper.${teamWrapperIndex}.teamName.name`).addListener(() => this.validate(rivalId))
				}
			);
		}

		this.teamWrapperListeners.push(
			{
				rivalId:	rivalId,
				listener:	binding.sub(`teamModeView.teamWrapper.${teamWrapperIndex}.isSetTeamLater`).addListener(() => this.validate(rivalId))
			}
		);

		this.addSyncListenersByRivalId(rivalId);
	},
	addSyncListenersByRivalId: function(rivalId) {
		this.addListenerToIsLoadingTeamByRivalId(rivalId);
		this.addListenerToTeamManagerIsSearchByRivalId(rivalId);
	},
	addListenerToIsLoadingTeamByRivalId: function(rivalId) {
		const	binding				= this.getDefaultBinding(),
				teamWrappers		= binding.toJS(`teamModeView.teamWrapper`);

		let		teamWrapperIndex	= teamWrappers.findIndex(tw => tw.rivalId === rivalId);

		this.teamWrapperListeners.push(
			{
				rivalId:	rivalId,
				listener:	binding.sub(`teamModeView.teamWrapper.${teamWrapperIndex}.isLoadingTeam`).addListener(eventDescriptor => {
					// team wrapper is loading data
					if(eventDescriptor.getCurrentValue()) {
						binding.set('isSync', false);
					}

					// team wrapper isn't loading data
					if(
						!eventDescriptor.getCurrentValue() &&
						!binding.get(`teamModeView.teamWrapper.${teamWrapperIndex}.___teamManagerBinding.isSearch`)
					) {
						binding.set('isSync', true);
					}
				})
			}
		);
	},
	addListenerToTeamManagerIsSearchByRivalId: function(rivalId) {
		const	binding				= this.getDefaultBinding(),
				teamWrappers		= binding.toJS(`teamModeView.teamWrapper`);

		let		teamWrapperIndex	= teamWrappers.findIndex(tw => tw.rivalId === rivalId);

		this.teamWrapperListeners.push(
			{
				rivalId:	rivalId,
				listener:	binding.sub(`teamModeView.teamWrapper.${teamWrapperIndex}.___teamManagerBinding.isSearch`).addListener(eventDescriptor => {
					// player selector is loading data
					if(eventDescriptor.getCurrentValue()) {
						binding.set('isSync', false);
					}

					// player selector isn't loading data
					if(!eventDescriptor.getCurrentValue() && !binding.get(`teamModeView.teamWrapper.${teamWrapperIndex}.isLoadingTeam`)) {
						binding.set('isSync', true);
					}
				})
			}
		);
	},
	validate: function(rivalId) {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				errorBinding	= self.getBinding('error');

		const	teamWrappers		= binding.toJS(`teamModeView.teamWrapper`),
				teamWrapper			= teamWrappers.find(tw => tw.rivalId === rivalId);

		if(typeof teamWrapper !== 'undefined') {
			const	errorArray			= errorBinding.toJS(),
					errorIndex			= errorArray.findIndex(e => e.rivalId === rivalId),
					isSetTeamLater		= teamWrapper.isSetTeamLater,
					subscriptionPlan	= this.getActiveSchool().subscriptionPlan;

			let result = {
				isError:	false,
				text:		''
			};
			// process data if setTeamLater is FALSE and team wrapper is active
			// in any other case just set def validation result data
			if(!isSetTeamLater && teamWrapper.isActive) {
				const event = binding.toJS('model');

				if(
					typeof event !== 'undefined' &&
					typeof event.sportModel !== 'undefined'
				) {
					const limits = typeof event.sportModel.defaultLimits !== 'undefined' ? {
						maxPlayers:	event.sportModel.defaultLimits.maxPlayers,
						minPlayers:	event.sportModel.defaultLimits.minPlayers,
						minSubs:	event.sportModel.defaultLimits.minSubs,
						maxSubs:	event.sportModel.defaultLimits.maxSubs
					} : {minPlayers: 1};

					switch (true) {
						case TeamHelper.isNonTeamSport(event): {
							result = TeamPlayersValidator.validate(
								teamWrapper.___teamManagerBinding.teamStudents,
								limits,
								subscriptionPlan
							);
						}
							break;
						case TeamHelper.isTeamSport(event): {
							if (
								teamWrapper.teamName.name === undefined ||
								teamWrapper.teamName.name === ''
							) {
								result = {
									isError:	true,
									text:		'Please enter team name'
								};
							} else {
								result = TeamPlayersValidator.validate(
									teamWrapper.___teamManagerBinding.teamStudents,
									limits,
									subscriptionPlan,
									true
								);
							}
						}
							break;
					}
				}
			}

			// set result
			errorArray[errorIndex].isError = result.isError;
			errorArray[errorIndex].text = result.text;
			errorBinding.set(
				Immutable.fromJS(errorArray)
			);
		}
	},
	initRivalIndex: function() {
		const	self		= this,
				event	= self.getDefaultBinding().toJS('model');
		let		currentRivalIndex;

		if(EventHelper.isInterSchoolsEvent(event)) {
			let	activeSchoolId	= this.props.activeSchoolId,
				rivals			= self.getBinding().rivals.toJS();

			for(let rivalIndex in rivals) {
				if(rivals[rivalIndex].school.id === activeSchoolId) {
					currentRivalIndex = rivalIndex;
					break;
				}
			}
		} else {
			currentRivalIndex = 0;
		}

		return currentRivalIndex;
	},
	addNewEmptyRivalForInternalTeamSportEvent: function() {
		const	binding			= this.getDefaultBinding(),
				rivals			= this.getBinding().rivals.toJS(),
				teamModeView	= binding.toJS('teamModeView');

		rivals.push(
			new InternalRivalModel(
				this.getActiveSchool()
			)
		);

		this.getBinding().rivals.set(Immutable.fromJS(rivals));

		const newRivalIndex = rivals.length - 1;

		// push empty team table model to team table array
		teamModeView.teamTable.push(
			this.getTeamTableByRivalIndex(newRivalIndex)
		);

		teamModeView.teamWrapper.push(
			this.getTeamWrapperByRivalIndex(newRivalIndex)
		);

		binding.set('teamModeView',	Immutable.fromJS(teamModeView));

		const error = this.getBinding('error').toJS();
		error.push({
			isError:	false,
			text:		''
		});
		this.getBinding('error').set(Immutable.fromJS(error));

		// add listeners
		this.addTeamWrapperListenersByRivalId(newRivalIndex);

		this.validate(newRivalIndex);
	},
	addNewEmptyRivalForInterSchoolsEventBySchool: function(school) {
		const	binding			= this.getDefaultBinding();

		const	rivals			= this.getBinding().rivals.toJS(),
				teamModeView	= binding.toJS('teamModeView');

		// Add new rival
		const rival = new InterSchoolsRivalModel(school);
		rivals.push(rival);
		this.getBinding().rivals.set(Immutable.fromJS(rivals));

		const newRivalIndex = rivals.length - 1;

		// push empty team table model to team table array
		teamModeView.teamTable.push(
			this.getTeamTableByRivalIndex(newRivalIndex)
		);

		const teamWrapper = this.getTeamWrapperByRivalIndex(newRivalIndex);
		teamModeView.teamWrapper.push(teamWrapper);

		binding.set('teamModeView',	Immutable.fromJS(teamModeView));

		const error = this.getBinding('error').toJS();
		error.push(this.createErrorObjectByRival(rival));
		this.getBinding('error').set(Immutable.fromJS(error));

		// add listeners
		this.addTeamWrapperListenersByRivalId(teamWrapper.rivalId);

		this.validate(teamWrapper.rivalId);
	},
	removeRival: function(rivalId) {
		const binding = this.getDefaultBinding();

		const	rivals				= this.getBinding().rivals.toJS(),
				teamModeView		= binding.toJS('teamModeView'),
				selectedRivalIndex	= teamModeView.selectedRivalIndex,
				selectedRival		= rivals[selectedRivalIndex];

		// FIRST REMOVE LISTENERS
		// remove listeners
		this.removeTeamWrapperListenersByRivaId(rivalId);

		// remove rival
		const rivalIndexToRemove = rivals.findIndex(r => r.id === rivalId);
		rivals.splice(rivalIndexToRemove, 1);

		// remove team mode view
		const teamWrapperIndexToRemove = teamModeView.teamWrapper.findIndex(tw => tw.rivalId === rivalId);

		// call object to remove listeners
		binding.set(`teamModeView.teamWrapper.${teamWrapperIndexToRemove}.isActive`, false);

		teamModeView.teamWrapper.splice(teamWrapperIndexToRemove, 1);

		// remove team table
		const teamTableIndexToRemove	= teamModeView.teamTable.findIndex(tt => tt.rivalId === rivalId);
		teamModeView.teamTable.splice(teamTableIndexToRemove, 1);

		// remove error info object
		const error = this.getBinding('error').toJS();
		error.splice(
			error.findIndex(e => e.rivalId === rivalId),
			1
		);

		//set new selected rival index
		teamModeView.selectedRivalIndex = this.getNewSelectedRivalIndex(
			rivals,
			rivalIndexToRemove,
			selectedRival.id,
			selectedRivalIndex
		);

		// save changes
		this.getBinding().rivals.set(
			Immutable.fromJS(rivals)
		);
		binding.set('teamModeView',	Immutable.fromJS(teamModeView));
		this.getBinding('error').set(
			Immutable.fromJS(error)
		);
	},
	handleClickAddTeam: function() {
		const binding = this.getDefaultBinding();

		const event = binding.toJS('model');

		// function for select new rival
		const selectNewRival = () => binding.set('teamModeView.selectedRivalIndex', Immutable.fromJS( this.getBinding('rivals').toJS().length - 1) );
		if(EventHelper.isInterSchoolsEvent(event) && event.sportModel.multiparty) {
			// For inter schools event we add new rival only for active school.
			// It's business logic.
			// School info it is active school data
			const activeSchool = this.getActiveSchool();
			this.addNewEmptyRivalForInterSchoolsEventBySchool(activeSchool);

			selectNewRival();
		} else if(TeamHelper.isInternalEventForTeamSport(event)) {
			this.addNewEmptyRivalForInternalTeamSportEvent();

			selectNewRival();
		}
	},
	handleClickRemoveTeam: function(rivalId) {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model');

		if(EventHelper.isInterSchoolsEvent(event) && event.sportModel.multiparty) {
			this.removeRival(rivalId);
		}
	},
	/**
	 * Function calculates new selected rival index after rival was removed
	 * @param updRivals - new rivals array without removed rival
	 * @param removedRivalIndex - index of removed rival
	 * @param selectedRivalId - id of current selected rival
	 * @param selectedRivalIndex - index of current selected rival
	 * @returns {number}
	 */
	getNewSelectedRivalIndex: function(updRivals, removedRivalIndex, selectedRivalId, selectedRivalIndex) {
		let newSelectedRivalIndex = -1;

		const activeSchoolId = this.props.activeSchoolId

		const getFirstActiveSchoolRivalIndex = () => {
			for(let i = 0; i < updRivals.length; i++) {
				if(updRivals[i].school.id === activeSchoolId) {
					return i;
				}
			}
		};

		switch (true) {
			case removedRivalIndex === selectedRivalIndex: {
				newSelectedRivalIndex = getFirstActiveSchoolRivalIndex();
				break;
			}
			default: {
				// just find index of selected rival in updated rival array
				newSelectedRivalIndex = updRivals.findIndex(r => r.id === selectedRivalId);
				break;
			}
		}

		// it's plan B, if for some reason newSelectedRivalIndex was not found
		if(newSelectedRivalIndex === -1) {
			newSelectedRivalIndex = getFirstActiveSchoolRivalIndex();
		}

		return newSelectedRivalIndex;
	},
	renderGameField: function() {
		const binding = this.getDefaultBinding();

		switch (true) {
			case TeamHelper.isNonTeamSport(binding.toJS('model')):
				return null;
			case TeamHelper.isTeamSport(binding.toJS('model')):
				return (
					<div className="eManager_gameFieldContainer">
						<GameField binding={binding.sub('model.sportModel.field.pic')}/>
					</div>
				);
		}
	},
	renderRivals: function() {
		if(this.props.isShowRivals) {
			return (
				<RivalChooser
					binding					= { this.getBinding() }
					activeSchoolId			= { this.props.activeSchoolId }
					isInviteMode			= { this.props.isInviteMode }
					isShowAddTeamButton		= { this.props.isShowAddTeamButton }
					indexOfDisplayingRival	= { this.props.indexOfDisplayingRival }
					handleClickAddTeam		= { this.handleClickAddTeam }
					handleClickRemoveTeam	= { this.handleClickRemoveTeam }
				/>
			);
		} else {
			return null;
		}
	},
	render: function() {
		const	defaultBinding		= this.getDefaultBinding(),
				binding				= this.getBinding(),
				teamBundleBinding	= {
					default:	defaultBinding.sub(`teamModeView`),
					schoolInfo:	defaultBinding.sub('schoolInfo'),
					model:		defaultBinding.sub('model'),
					rivals:		defaultBinding.sub('rivals'),
					error:		binding.error
				};

		return (
			<div className="bTeamsManager">
				{ this.renderRivals() }
				<div className="eTeamsManager_body">
					<TeamBundle binding={teamBundleBinding}/>
					{ this.renderGameField() }
				</div>
			</div>
		);
	}
});

module.exports = Manager;