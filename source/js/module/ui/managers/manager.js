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
		isShowRivals			: React.PropTypes.bool,
		isInviteMode			: React.PropTypes.bool,
		isShowAddTeamButton		: React.PropTypes.bool,
		indexOfDisplayingRival	: React.PropTypes.number
	},
	listeners: [],
	teamWrapperListeners: [],
	componentWillMount: function () {
		const self = this;

		self.initDefaultBinding();
		self.initErrorBinding();
		self.addListeners();

		if(typeof this.props.indexOfDisplayingRival !== 'undefined') {
			let rivalId = this.props.indexOfDisplayingRival;
			if(
				EventHelper.isInterSchoolsEvent(
					this.getDefaultBinding().toJS('model')
				)
			) {
				rivalId = this.getBinding('rivals').toJS()[this.props.indexOfDisplayingRival].id;
			}

			self.validate(rivalId);
		} else {
			const	binding		= this.getDefaultBinding(),
					teamWrapper	= binding.toJS('teamModeView.teamWrapper');

			teamWrapper.forEach(tw => this.validate(tw.rivalId));
		}
	},
	componentWillUnmount: function() {
		const binding = this.getDefaultBinding();

		this.listeners.forEach(l => binding.removeListener(l));
		this.removeAllTeamWrapperListeners();
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
		const	self			= this,
				defaultBinding	= self.getDefaultBinding(),
				binding			= self.getBinding();

		// Init rival index if need
		if(binding.selectedRivalIndex.toJS() === null) {
			self.initRivalIndex();
		}

		const	teamTable	= this.getTeamTables(),
				teamWrapper	= this.getTeamWrappers(),
				rivalsCount	= this.getBinding('rivals').toJS().length;

		defaultBinding
			.atomically()
			.set('isSync', true)
			.set('teamModeView', Immutable.fromJS(
				{
					rivalsCount:		Immutable.fromJS(rivalsCount),
					selectedRivalIndex:	defaultBinding.get('selectedRivalIndex'),
					players:			self.getInitPlayers(),
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
		const event = this.getDefaultBinding().toJS('model');

		if(EventHelper.isInterSchoolsEvent(event)) {
			return new Error(rival.id, '', false);
		} else {
			return new Error(undefined, '', false);
		}
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
				teamName		= this.getTeamNameByOrder(rivalIndex),
				schoolId		= this.getSchoolIdByRivalId(currentRival.id);

		return {
			rivalId: currentRival.id,
			willRemove: false,
			isLoadingTeam: false,
			filter: undefined,
			schoolId: schoolId,
			prevSelectedTeamId: teamId,
			selectedTeamId: teamId,
			teamsSaveMode: undefined,
			teamName: {
				initName: teamName,
				name: teamName,
				mode: 'show'
			},
			___teamManagerBinding: {
				teamStudents: [],
				blackList: [],
				positions: defaultBinding.get('model.sportModel.field.positions')
			},
			savingChangesMode: ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES,
			isSetTeamLater: false
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
	getInitPlayers: function() {
		const binding = this.getBinding();

		const rivals = binding.rivals.toJS();

		return rivals.map((rival, rivalIndex) => this.getInitPlayersByOrder(rivalIndex));
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
	/**
	 * Return schoolId for rival by rivalId
	 * Only for Interschools multyparty event
	 * @param order
	 * @returns {*}
	 */
	getSchoolIdByRivalId: function(rivalId) {
		let schoolId;

		const event = this.getDefaultBinding().toJS('model');
		if(
			EventHelper.isInterSchoolsEvent(event) &&
			TeamHelper.isMultiparty(event)
		) {
			const binding = this.getBinding();

			if(typeof binding.rivals !== "undefined") {
				const	rivals			= binding.rivals.toJS(),
						currentRival	= rivals.find(r => r.id === rivalId);

				schoolId = propz.get(currentRival, ['school', 'id']);
			}
		}

		return schoolId;
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

		// set selected rival index for teamModeView
		this.listeners.push(binding.sub('selectedRivalIndex').addListener(() => {
			binding.set('teamModeView.selectedRivalIndex', binding.toJS('selectedRivalIndex'))
		}));

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
					if(!eventDescriptor.getCurrentValue() && !binding.get(`teamModeView.teamWrapper.${teamWrapperIndex}.___teamManagerBinding.isSearch`)) {
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
				subscriptionPlan	= binding.toJS('schoolInfo.subscriptionPlan');

			let result = {
				isError:	false,
				text:		''
			};
			// process data if setTeamLater is FALSE
			// in any other case just set def validation result data
			if(!isSetTeamLater) {
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

		if(TeamHelper.getEventType(event) === 'inter-schools') {
			let	activeSchoolId	= self.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
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

		self.getBinding('selectedRivalIndex').set(Immutable.fromJS(currentRivalIndex));
	},
	addNewEmptyRivalForInternalTeamSportEvent: function() {
		const	binding			= this.getDefaultBinding(),
				rivals			= this.getBinding().rivals.toJS(),
				teamModeView	= binding.toJS('teamModeView');

		rivals.push(new InternalRivalModel());

		this.getBinding().rivals.set(Immutable.fromJS(rivals));

		const newRivalIndex = rivals.length - 1;
		// push empty players array
		teamModeView.players.push(
			this.getInitPlayersByOrder(newRivalIndex)
		);

		// push empty team table model to team table array
		teamModeView.teamTable.push(
			this.getTeamTableByRivalIndex(newRivalIndex)
		);

		teamModeView.teamWrapper.push(
			this.getTeamWrapperByRivalIndex(newRivalIndex)
		);

		teamModeView.rivalsCount = rivals.length;

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
		// New rival construct by
		const rival = new InterSchoolsRivalModel(school);
		rivals.push(rival);

		this.getBinding().rivals.set(Immutable.fromJS(rivals));

		const newRivalIndex = rivals.length - 1;
		// push empty players array
		teamModeView.players.push(
			this.getInitPlayersByOrder(newRivalIndex)
		);

		// push empty team table model to team table array
		teamModeView.teamTable.push(
			this.getTeamTableByRivalIndex(newRivalIndex)
		);

		const teamWrapper = this.getTeamWrapperByRivalIndex(newRivalIndex);
		teamModeView.teamWrapper.push(teamWrapper);

		teamModeView.rivalsCount = rivals.length;

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

		// FIRST REMOVE LISTENERS
		// remove listeners
		this.removeTeamWrapperListenersByRivaId(rivalId);

		// remove rival
		const	rivals				= this.getBinding().rivals.toJS(),
				currentRivalIndex	= rivals.findIndex(r => r.id === rivalId);

		rivals.splice(currentRivalIndex, 1);

		// remove team mode view
		const	teamModeView			= binding.toJS('teamModeView'),
				currentTeamWrapperIndex	= teamModeView.teamWrapper.findIndex(tw => tw.rivalId === rivalId);

		// call object to remove listeners
		teamModeView.teamWrapper[currentTeamWrapperIndex].willRemoveListeners = true;
		binding.set('teamModeView',	Immutable.fromJS(teamModeView));

		teamModeView.teamWrapper.splice(currentTeamWrapperIndex, 1);
		teamModeView.rivalsCount = rivals.length;

		// remove team table
		const currentTeamTableIndex	= teamModeView.teamTable.findIndex(tt => tt.rivalId === rivalId);
		teamModeView.teamTable.splice(currentTeamTableIndex, 1);

		// TODO remove players

		// remove error info object
		const error = this.getBinding('error').toJS();
		error.splice(
			error.findIndex(e => e.rivalId === rivalId),
			1
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
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model');

		if(EventHelper.isInterSchoolsEvent(event) && event.sportModel.multiparty) {
			// For inter schools event we add new rival only for active school.
			// It's business logic.
			// School info it is active school data
			const activeSchool = binding.toJS('schoolInfo');

			this.addNewEmptyRivalForInterSchoolsEventBySchool(activeSchool);
		} else if(TeamHelper.isInternalEventForTeamSport(event)) {
			this.addNewEmptyRivalForInternalTeamSportEvent();
		}
	},
	handleClickRemoveTeam: function(rivalId) {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model');

		if(EventHelper.isInterSchoolsEvent(event) && event.sportModel.multiparty) {
			const	activeSchoolId		= this.getDefaultBinding().toJS('schoolInfo.id'),
					rivals				= this.getBinding('rivals').toJS(),
					removedRivalIndex	= rivals.findIndex(r => r.id === rivalId),
					selectedRivalIndex	= this.getBinding('selectedRivalIndex').toJS(),
					selectedRival		= rivals[selectedRivalIndex];

			this.removeRival(rivalId);

			if(removedRivalIndex === selectedRivalIndex) {
				const updRivals = this.getBinding('rivals').toJS();

				// just find index of next rival
				for(let i = 0; i < updRivals.length; i++) {
					if(updRivals[i].school.id === activeSchoolId) {
						this.getBinding('selectedRivalIndex').set(Immutable.fromJS(i));
						break;
					}
				}
			} else if(removedRivalIndex < selectedRivalIndex) {
 				// just find index of selected rival in updated rival array
				const	updRivals				= this.getBinding('rivals').toJS(),
						updSelectedRivalIndex	= updRivals.findIndex(r => r.id === selectedRival.id);

				this.getBinding('selectedRivalIndex').set(Immutable.fromJS(updSelectedRivalIndex));
			}
		}
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

		console.log(`TEAM WRAPPERS LENGTH ${defaultBinding.toJS('teamModeView.teamWrapper').length}`);

		defaultBinding.toJS('teamModeView.teamWrapper').forEach((tw) => {
			console.log(`#${tw.rivalId} WILL REMOVE LISTENERS ${tw.willRemove}`);
		});

		return (
			<div className="bTeamsManager">
				{ this.renderRivals() }
				<div className="eTeamsManager_body">
					<TeamBundle binding={teamBundleBinding}/>
					{this.renderGameField()}
				</div>
			</div>
		);
	}
});

module.exports = Manager;