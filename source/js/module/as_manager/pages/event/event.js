const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),
		Lazy							= require('lazy.js'),
		{If}							= require('module/ui/if/if'),
		classNames						= require('classnames'),
		Promise 						= require('bluebird');

const	Rivals							= require('module/as_manager/pages/event/view/rivals/rivals'),
		Tabs							= require('./../../../ui/tabs/tabs'),
		CreateOtherEventPanel			= require('./view/create_other_event_panel/create_other_event_panel'),
		EventHeaderWrapper				= require('./view/event_header/event_header_wrapper'),
		IndividualScoreAvailableBlock	= require('./view/individual_scores_available_block/individual_score_available_block'),
		EventRivals						= require('./view/event_rivals'),
		EditingTeamsButtons 			= require('./view/editing_teams_buttons'),
		EventTeams						= require('./view/teams/event_teams'),
		Performance						= require('./view/performance/performance'),
		NewPerformance					= require('./view/new_performance/new_performance'),
		DisciplineWrapper				= require('./view/discipline/discipline_wrapper'),
		NewDiscipline					= require('module/as_manager/pages/event/view/new_discipline/new_discipline'),
		TasksWrapper					= require('./view/tasks/tasks_wrapper'),
		EventGallery					= require('./new_gallery/event_gallery'),
		ManagerWrapper					= require('./view/manager_wrapper/manager_wrapper'),
		Comments						= require('./view/event_blog'),
		TeamHelper						= require('module/ui/managers/helpers/team_helper'),
		EventResultHelper				= require('./../../../helpers/event_result_helper'),
		DetailsWrapper					= require('./view/details/details_wrapper'),
		MatchReport						= require('./view/match-report/report'),
		{Map}							= require('../../../ui/map/map2'),
		EditEventPopup					= require('./view/edit_event_popup/edit_event_popup'),
		GalleryActions					= require('./new_gallery/event_gallery_actions'),
		AddPhotoButton					= require('../../../ui/new_gallery/add_photo_button'),
		{Button}						= require('../../../ui/button/button'),
		EventHelper						= require('module/helpers/eventHelper'),
		SportHelper 					= require('module/helpers/sport_helper'),
		RoleHelper						= require('./../../../helpers/role_helper'),
		OpponentSchoolManager			= require('module/as_manager/pages/event/view/opponent_school_manager/opponent_school_manager'),
		SelectForCricketWrapper 		= require('module/as_manager/pages/event/view/rivals/select_for_cricket/select_for_cricket_wrapper'),
		CricketResultBlock				= require('module/as_manager/pages/event/view/cricket_result_block/cricket_result_block'),
		ParentalConsentTab				= require('module/as_manager/pages/event/view/parental_consent_tab/parental_consent_tab'),
		ParentalReportsTab				= require('module/as_manager/pages/event/view/parental_report_tab/parental_report_tab'),
		{MessageListActions}			= require('module/as_manager/pages/messages/message_list_wrapper/message_list_actions/message_list_actions'),
		{ConfirmPopup}					= require('module/ui/confirm_popup'),
		EventHeaderActions 				= require('module/as_manager/pages/event/view/event_header/event_header_actions'),
		ViewModeConsts					= require('module/ui/view_selector/consts/view_mode_consts'),
		RandomHelper					= require('module/helpers/random_helper'),
		SelectForCricketWrapperStyles	= require('styles/ui/select_for_cricket/select_for_cricket_wrapper.scss'),
		SchoolHelper 					= require('module/helpers/school_helper'),
		ManagerGroupChanges 			= require('module/ui/manager_group_changes/managerGroupChanges'),
		Popup                           = require('module/ui/popup'),
		{ConsentRequestPopup}           = require('module/as_manager/pages/event/view/consent_request/consent_request_popup'),
		propz							= require('propz');

const 	EventFormConsts 	= require('module/as_manager/pages/events/manager/event_form/consts/consts'),
		EventConsts			= require('module/helpers/consts/events');

const Event = React.createClass({
	mixins: [Morearty.Mixin],
	listeners: [],
	propTypes: {
		activeSchoolId:			React.PropTypes.string.isRequired,
		mode:					React.PropTypes.string.isRequired,
		onReload:				React.PropTypes.func.isRequired,
		// it's main rule(top priority) for displaying control buttons at rivals
		isShowControlButtons:	React.PropTypes.bool.isRequired
	},
	getDefaultProps: function(){
		return {
			isShowControlButtons: true
		};
	},
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			rivalsComponentKey: RandomHelper.getRandomString(),
			viewMode: ViewModeConsts.VIEW_MODE.BLOCK_VIEW,
			isRivalsSync: false,
			isNewEvent: false,
			isEditEventPopupOpen: false,
			isDeleteEventPopupOpen: false,
			isConsentRequestPopupOpen: false,
			model: {},
			gallery: {
				photos: [],
				isUploading: false,
				isSync: false
			},
			tabListModel: [],
			sync: false,
			mode: 'general',
			showingComment: false,
			activeTab: 'teams',
			eventTeams: {},
			performanceTab: {
				isEditMode: false
			},
			disciplineTab: {
				isEditMode: false
			},
			tasksTab: {
				viewMode		: "VIEW",
				tasks			: [],
				editingTask		: undefined
			},
			autocompleteChangeOpponentSchool: {
				school: undefined
			},
			individualScoreAvailable: [
				{
					value					: false,
					isTeamScoreWasChanged	: false
				},
				{
					value					: false,
					isTeamScoreWasChanged	: false
				}
			],
			editEventPopup: {
				eventEditForm: {}
			},
			parentalConsentTab: {
				isSync: false,
				messages: []
			},
			parentalReportsTab: {
				isSync: false,
				messages: []
			}
		});
	},
	componentWillMount: function () {
		const	self		= this,
				rootBinding	= self.getMoreartyContext().getBinding(),
				role		= RoleHelper.getLoggedInUserRole(this),
				binding		= self.getDefaultBinding();

		self.role = role;
		self.eventId = rootBinding.get('routing.pathParameters.0');

		SchoolHelper.loadActiveSchoolInfo(this);

		this.initIsNewEventFlag();

		let eventData, report, photos, settings, tasks, parentalConsentTabMessages, parentalReportsTabMessages;
		//For different roles we use different service
		const service = this.getServiceForEvent(role);

		window.Server.school.get(this.props.activeSchoolId).then(activeSchool => {
			binding.set('activeSchoolInfo', Immutable.fromJS(activeSchool));

			return service.get({
				schoolId	: this.props.activeSchoolId,
				eventId		: self.eventId
			});
		}).then(event => {
			eventData = event;
			eventData.schoolCreatorType = this.props.mode;

			return TeamHelper.getSchoolsArrayWithFullDataByEvent(eventData);
		}).then(_schoolsData => {
			const schoolsData = _schoolsData.filter(s => s.kind !== 'SchoolUnion');

			eventData.schoolsData = schoolsData;
				if(TeamHelper.isIndividualSport(eventData)) {
					eventData.individualsData = eventData.individualsData.sort((player1, player2) => {
						if (!player1 || !player2 || player1.firstName === player2.firstName) {
							return 0;
						}
						if (player1.firstName < player2.firstName) {
							return -1;
						}
						if (player1.firstName > player2.firstName) {
							return 1;
						}
					});
				}

			eventData.teamsData = eventData.teamsData.sort((t1, t2) => {
				if (!t1 || !t2 || t1.name === t2.name) {
					return 0;
				}
				if (t1.name < t2.name) {
					return -1;
				}
				if (t1.name > t2.name) {
					return 1;
				}
			});
			eventData.housesData = eventData.housesData.sort((h1, h2) => {
				if (!h1 || !h2 || h1.name === h2.name) {
					return 0;
				}
				if (h1.name < h2.name) {
					return -1;
				}
				if (h1.name > h2.name) {
					return 1;
				}
			});
			// FUNCTION MODIFY EVENT OBJECT!!
			//TODO it's temp. only for event refactoring period.
			if(!TeamHelper.isNewEvent(eventData)) {
				EventResultHelper.initializeEventResults(eventData);
			}

			// loading match report
			return window.Server.schoolEventReport.get({
				schoolId: this.props.activeSchoolId,
				eventId: self.eventId
			});
		}).then(_report => {
			report = _report;
			if (
				RoleHelper.getLoggedInUserRole(this) === RoleHelper.USER_ROLES.PARENT ||
				RoleHelper.getLoggedInUserRole(this) === RoleHelper.USER_ROLES.STUDENT
			) {
				return Promise.resolve(undefined);
			} else {
				return window.Server.schoolEventInvites.get({
					schoolId: this.props.activeSchoolId,
					eventId: self.eventId
				});
			}

		}).then(invites => {
			eventData.invites = invites;

			return this.loadPhotos(RoleHelper.getLoggedInUserRole(this));
		}).then(_photos => {
			photos = _photos;

			return window.Server.schoolSettings.get({schoolId: this.props.activeSchoolId});
		}).then(_settings => {
			settings = _settings;

			return window.Server.schoolEventTasks.get(
				{
					schoolId	: this.props.activeSchoolId,
					eventId		: self.eventId
				}
			);
		}).then(_tasks => {
			tasks = _tasks;

			return this.loadParentalConsentMessages();
		}).then(_parentalConsentTabMessages => {
			parentalConsentTabMessages = _parentalConsentTabMessages;

			return this.loadParentalReportsMessages();
		}).then(_parentalReportsTabMessages => {
			parentalReportsTabMessages = _parentalReportsTabMessages;

			eventData.matchReport = report.content;
			eventData.individualScoreForRemove = [];

			// TODO it's temp plug
			this.fixEventResultsData(eventData);

			this.setPlayersFromEventToBinding(eventData);
			// !!Function upd args
			this.initIsDisplayResultsOnPublic(eventData);
			binding.atomically()
				.set('model',								Immutable.fromJS(eventData))
				.set('gallery.photos',						Immutable.fromJS(photos))
				.set('gallery.isUserCanUploadPhotos',		Immutable.fromJS(settings.photosEnabled))
				.set('gallery.isSync',						true)
				.set('tasksTab.tasks',						Immutable.fromJS(tasks.filter(t => t.schoolId === this.props.activeSchoolId)))
				.set('isUserCanWriteComments',				Immutable.fromJS(settings.commentsEnabled))
				.set('mode',								Immutable.fromJS('general'))
				.set('individualScoreAvailable.0.value',	this.getInitValueForIndividualScoreAvailableFlag(0, eventData))
				.set('individualScoreAvailable.1.value',	this.getInitValueForIndividualScoreAvailableFlag(1, eventData))
				.set('parentalConsentTab.isSync',			true)
				.set('parentalConsentTab.messages',			Immutable.fromJS(parentalConsentTabMessages))
				.set('parentalReportsTab.isSync',			true)
				.set('parentalReportsTab.messages',			Immutable.fromJS(parentalReportsTabMessages))
				.commit();

			self.initTabs();

			//TODO it's temp. only for event refactoring period.
			if(
				TeamHelper.isTeamSport(eventData) &&
				!TeamHelper.isInterSchoolsEventForTeamSport(eventData) &&
				!TeamHelper.isHousesEventForTeamSport(eventData) &&
				!TeamHelper.isInternalEventForTeamSport(eventData) &&
				!eventData.sport.multiparty &&
				!SportHelper.isCricket(eventData.sport.name)
			) {
				this.initTeamIdForIndividualScoreAvailableFlag();
			}
			binding.set('sync', Immutable.fromJS(true));

			this.addListeners();

			return eventData;
		});
	},
	//Load all user integrations from server, because we want button "tweet" only user with twitter integration
	//Note: We do not care when promises are made, because we use this data only if user click button "tweet"
	componentDidMount: function(){
		const 	binding 		= this.getDefaultBinding(),
				role 			= typeof RoleHelper.getLoggedInUserRole(this) !== 'undefined' ? RoleHelper.getLoggedInUserRole(this) : '';

		if (role === RoleHelper.USER_ROLES.ADMIN) { //TODO When the server is ready, delete it
			window.Server.integrations.get({ schoolId : this.props.activeSchoolId }).then( integrations => {
				//we choose only twitter integrations
				integrations = integrations.filter( integration => integration.type === 'twitter');
				if (integrations.length > 0) {
					binding.set('twitterData', Immutable.fromJS(integrations));
					binding.set('twitterIdDefault', integrations[0].id); // while we wait isFavorite from server, we made isFavorite first id
				}
			});
		}
	},
	fixEventResultsData: function(eventData) {
		for(let key in eventData.results) {
			const results = eventData.results[key];
			if(Array.isArray(results)) {
				results.forEach(resultsData => {
					const score = propz.get(resultsData, ['richScore', 'result']);
					if(typeof score !== 'undefined') {
						delete resultsData.richScore.result
					}
				});
			}
		}
	},
	loadParentalConsentMessages: function() {
		switch(true){
			case this.role === 'PARENT':
				return MessageListActions.loadParentRoleParentalConsentMessagesByEventId(
					this.eventId
				);
			case this.role !== 'STUDENT':
				return MessageListActions.loadParentalConsentMessagesByEventId(
					this.props.activeSchoolId,
					this.eventId
				);
			default:
				return Promise.resolve([]);
		}
	},
	loadParentalReportsMessages: function() {
		switch(true){
			case this.role === 'PARENT':
				return MessageListActions.loadParentRoleParentalReportsMessagesByEventId(
					this.eventId
				);
			case this.role !== 'STUDENT':
				return MessageListActions.loadParentalReportsMessagesByEventId(
					this.props.activeSchoolId,
					this.eventId
				);
			default:
				return Promise.resolve([]);
		}
	},
	isShowParentalConsentTab: function() {
		const binding = this.getDefaultBinding();

		const messages = binding.toJS('parentalConsentTab.messages');

		return messages.length > 0;
	},
	isShowParentalReportsTab: function() {
		const binding = this.getDefaultBinding();

		const messages = binding.toJS('parentalReportsTab.messages');

		return messages.length > 0;
	},
	getInitValueForIndividualScoreAvailableFlag: function(order, event) {
		//TODO it's temp. only for event refactoring period.
		switch (true) {
			case (this.props.mode === EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION): {
				return false;
			}
			case (TeamHelper.isNewEvent(event)): {
				return false;
			}
			default: {
				if(EventHelper.isNotFinishedEvent(event) && TeamHelper.isTeamSport(event)) {
					return false;
				} else if(EventHelper.isNotFinishedEvent(event) && !TeamHelper.isTeamSport(event)) {
					return true;
				} else if(!EventHelper.isNotFinishedEvent(event) && TeamHelper.isTeamSport(event)) {
					return this.isTeamHasGeneralScoreByOrder(order, event) && this.isTeamHasIndividualScoreByOrder(order, event);
				} else if(!EventHelper.isNotFinishedEvent(event) && !TeamHelper.isTeamSport(event)) {
					return true;
				}
			}
		}
	},
	hasTeamPlayersByOrder: function(event, order) {
		let hasTeamPlayers = false;

		let params;
		switch (order) {
			case 0:
				params = TeamHelper.getParametersForLeftContext(this.props.activeSchoolId, event);
				break;
			case 1:
				params = TeamHelper.getParametersForRightContext(this.props.activeSchoolId, event);
				break;
		}

		const team = event[params.bundleName][params.order];
		// Team is undefined when "set team later" is true and event type is inter-schools.
		// If bundleName isn't teamsData team doesn't have players.
		if(
			params.bundleName === "teamsData" && typeof team !== 'undefined' &&
			typeof team.players !== 'undefined' && team.players.length !== 0
		) {
			hasTeamPlayers = true;
		}

		return hasTeamPlayers;
	},
	isTeamHasGeneralScoreByOrder: function(order, event) {
		const activeSchoolId = this.props.activeSchoolId;

		let params;
		switch (order) {
			case 0:
				params = TeamHelper.getParametersForLeftContext(activeSchoolId, event);
				break;
			case 1:
				params = TeamHelper.getParametersForRightContext(activeSchoolId, event);
				break;
		}

		const team = event[params.bundleName][params.order];
		// team is undefined when "set team later" is true and event type is inter-schools.
		if(typeof team !== 'undefined') {
			// id of school, house or team.
			const id = team.id;
			switch (params.bundleName) {
				case "schoolsData":
					return typeof event.results.schoolScore.find(scoreData => scoreData.schoolId === id) !== 'undefined';
				case "housesData":
					return typeof event.results.houseScore.find(scoreData => scoreData.houseId === id) !== 'undefined';
				case "teamsData":
					return typeof event.results.teamScore.find(scoreData => scoreData.teamId === id) !== 'undefined';
			}
		} else {
			return false;
		}
	},
	isTeamHasIndividualScoreByOrder: function(order, event) {
		const activeSchoolId = this.props.activeSchoolId;

		let params;
		switch (order) {
			case 0:
				params = TeamHelper.getParametersForLeftContext(activeSchoolId, event);
				break;
			case 1:
				params = TeamHelper.getParametersForRightContext(activeSchoolId, event);
				break;
		}

		const team = event[params.bundleName][params.order];
		// team is undefined when "set team later" is true and event type is inter-schools.
		if(typeof team !== 'undefined') {
			// id of school, house or team.
			const id = team.id;
			switch (params.bundleName) {
				case "schoolsData":
					return false;
				case "housesData":
					return false;
				case "teamsData":
					return event.results.individualScore.filter(scoreData => scoreData.teamId === id).length !== 0;
			}
		} else {
			return false;
		}
	},
	//For different roles we use different service
	getServiceForEvent: function(role) {
		if (role!=='STUDENT') {
			return window.Server.schoolEvent
		} else {
			return window.Server.studentSchoolEvent
		}
	},
	initIsNewEventFlag: function() {
		const rootBinding = this.getMoreartyContext().getBinding();

		const isNewEvent = rootBinding.get('routing.parameters.new');

		this.getDefaultBinding().set('isNewEvent', isNewEvent === 'true');
	},
	componentWillUnmount: function() {
		this.listeners.forEach(listener => this.getDefaultBinding().removeListener(listener));
	},
	initTeamIdForIndividualScoreAvailableFlag: function() {
		this.initTeamIdForIndividualScoreAvailableFlagByOrder(0);
		this.initTeamIdForIndividualScoreAvailableFlagByOrder(1);
	},
	initTeamIdForIndividualScoreAvailableFlagByOrder: function(order) {
		const binding = this.getDefaultBinding();

		const	activeSchoolId	= this.props.activeSchoolId,
				event			= binding.toJS('model');

		let params;
		switch (order) {
			case 0:
				params = TeamHelper.getParametersForLeftContext(activeSchoolId, event);
				break;
			case 1:
				params = TeamHelper.getParametersForRightContext(activeSchoolId, event);
				break;
		}

		const team = event[params.bundleName][params.order];
		// team is undefined when "set team later" is true
		if(typeof team !== 'undefined') {
			// id of school, house or team.
			const id = team.id;
			switch (params.bundleName) {
				case "schoolsData":
					binding.set(`individualScoreAvailable.${order}.schoolId`, Immutable.fromJS(id));
					break;
				case "housesData":
					binding.set(`individualScoreAvailable.${order}.houseId`, Immutable.fromJS(id));
					break;
				case "teamsData":
					binding.set(`individualScoreAvailable.${order}.teamId`, Immutable.fromJS(id));
					break;
			}
		}
	},
	addListeners: function() {
		const event = this.getDefaultBinding().toJS('model');

		this.addListenerToEventTeams();

		if(TeamHelper.isNewEvent(event)) {
			this.addListenerToViewMode();
		}

		if(
			!TeamHelper.isInterSchoolsEventForTeamSport(event) &&
			!TeamHelper.isHousesEventForTeamSport(event) &&
			!TeamHelper.isInternalEventForTeamSport(event) &&
			!SportHelper.isCricket(event.sport.name)
		) {
			this.addListenerForIndividualScoreAvailable();
		}

		if(
			TeamHelper.isTeamSport(event) &&
			!TeamHelper.isInterSchoolsEventForTeamSport(event) &&
			!TeamHelper.isHousesEventForTeamSport(event) &&
			!TeamHelper.isInternalEventForTeamSport(event) &&
			!SportHelper.isCricket(event.sport.name)
		) {
			this.addListenerForTeamScore();
		}
		if (this.role !== 'STUDENT') {
			this.addListenerForParentalConsentMessages();
		}
		if(this.role !== 'STUDENT' && this.role !== 'PARENT') {
			this.addListenerForParentalReportMessages();
		}
	},
	addListenerForParentalConsentMessages: function() {
		const self = this;

		this.listeners.push(this.getDefaultBinding().sub('parentalConsentTab.messages').addListener(() => {
			if(self.isShowParentalConsentTab() && self.tabListModel.findIndex(t => t.value === 'parentalConsent') === -1) {
				self.tabListModel.push(
					{
						value		: 'parentalConsent',
						text		: 'Parental Consent',
						isActive	: false
					}
				);
			}
		}));
	},
	addListenerForParentalReportMessages: function() {
		const self = this;

		this.listeners.push(this.getDefaultBinding().sub('parentalReportsTab.messages').addListener(() => {
			if(self.isShowParentalReportsTab() && self.tabListModel.findIndex(t => t.value === 'parentalReports') === -1) {
				self.tabListModel.push(
					{
						value		: 'parentalReports',
						text		: 'Parental Reports',
						isActive	: false
					}
				);
			}
		}));
	},
	addListenerForTeamScore: function() {
		const binding = this.getDefaultBinding();

		const	teamScoreBinding	= binding.sub(`model.results.teamScore`),
				teamScores			= teamScoreBinding.toJS();

		for(let i = 0; i < teamScores.length; i++) {
			this.listeners.push(teamScoreBinding.sub(i).addListener(() => {
				const	isIndividualScoreAvailableArray = binding.toJS(`individualScoreAvailable`);

				const	teamId		= teamScores[i].teamId;

				const	foundIndex	= isIndividualScoreAvailableArray.findIndex(item => item.teamId === teamId),
						foundItem	= isIndividualScoreAvailableArray[foundIndex];

				if(typeof foundItem !== 'undefined' && !foundItem.value && !foundItem.isTeamScoreWasChanged) {
					binding.set(`individualScoreAvailable.${foundIndex}.isTeamScoreWasChanged`, true);
					this.clearIndividualScoreByTeamId(teamId);
				}
			}));
		}
	},
	addListenerForIndividualScoreAvailable: function() {
		const binding = this.getDefaultBinding();

		this.listeners.push(
			binding
				.sub('individualScoreAvailable.0.value')
				.addListener(eventDescriptor => this.handleIndividualAvailableFlagChanges(0, eventDescriptor))
		);
		this.listeners.push(
			binding
				.sub('individualScoreAvailable.1.value')
				.addListener(eventDescriptor => this.handleIndividualAvailableFlagChanges(1, eventDescriptor))
		);
	},
	handleIndividualAvailableFlagChanges: function(order, eventDescriptor) {
		const	binding			= this.getDefaultBinding(),
				activeSchoolId	= this.props.activeSchoolId,
				event			= binding.toJS('model');

		let params;
		switch (order) {
			case 0:
				params = TeamHelper.getParametersForLeftContext(activeSchoolId, event);
				break;
			case 1:
				params = TeamHelper.getParametersForRightContext(activeSchoolId, event);
				break;
		}

		const team = event[params.bundleName][params.order];
		if(typeof team !== 'undefined') {
			const teamId = team.id;

			!eventDescriptor.getCurrentValue() && this.setIndividualScoreForRemoveByTeamId(teamId);
			eventDescriptor.getCurrentValue() && this.clearIndividualScoreForRemoveByTeamId(teamId);

			if(binding.toJS(`individualScoreAvailable.${order}.isTeamScoreWasChanged`) && eventDescriptor.getCurrentValue()) {
				this.clearTeamScoreByTeamId(teamId);
				binding.set(`individualScoreAvailable.${order}.isTeamScoreWasChanged`, false);
			}
		}
	},
	clearIndividualScoreByTeamId: function(teamId) {
		const binding = this.getDefaultBinding();

		const updScore = binding.toJS(`model.results.individualScore`).filter(s => s.teamId !== teamId);

		binding.set(`model.results.individualScore`, Immutable.fromJS(updScore));
	},
	/**
	 * Function copy model.results.individualScore by teamId to model.individualScoreForRemove.
	 * individualScoreForRemove - it's a array of scores. These scores will be removed after score submit.
	 * @param teamId
	 */
	setIndividualScoreForRemoveByTeamId: function(teamId) {
		const binding = this.getDefaultBinding();

		const	individualScoreForRemove = binding.toJS(`model.individualScoreForRemove`),
				newIndividualScoreForRemove = binding.toJS(`model.results.individualScore`).filter(s => s.teamId === teamId);

		binding.set(
			`model.individualScoreForRemove`,
			Immutable.fromJS(individualScoreForRemove.concat(newIndividualScoreForRemove))
		);
	},
	clearIndividualScoreForRemoveByTeamId: function(teamId) {
		const binding = this.getDefaultBinding();

		const individualScoreForRemove = binding.toJS(`model.individualScoreForRemove`).filter(s => s.teamId !== teamId);

		binding.set(`model.individualScoreForRemove`, Immutable.fromJS(individualScoreForRemove));
	},
	clearTeamScoreByTeamId: function(teamId) {
		const binding = this.getDefaultBinding();

		const score = binding.toJS(`model.results.teamScore`);
		score.forEach(s => {
			if(s.teamId === teamId) {
				s.score = 0;
			}
		});

		binding.set(`model.results.teamScore`, Immutable.fromJS(score));
	},
	addListenerToEventTeams: function() {
		const binding = this.getDefaultBinding();

		// reload players from server if isSync is false.
		this.listeners.push(binding.sub('eventTeams.isSync').addListener(descriptor => !descriptor.getCurrentValue() && this.loadPlayers()));
	},
	addListenerToViewMode: function() {
		const binding = this.getDefaultBinding();

		this.listeners.push(
			binding.sub('viewMode').addListener(descriptor => {
				if(
					descriptor.getCurrentValue() === ViewModeConsts.VIEW_MODE.OVERALL_VIEW ||
					descriptor.getPreviousValue() === ViewModeConsts.VIEW_MODE.OVERALL_VIEW
				) {
					this.reloadRivals();
				}
			})
		);
	},
	reloadRivals: function () {
		this.getDefaultBinding().set(
			'rivalsComponentKey',
			RandomHelper.getRandomString()
		);
	},
	/**
	 * Load team players from server
	 * @private
	 */
	loadPlayers: function() {
		window.Server.schoolEvent.get(
			{
				schoolId:	this.props.activeSchoolId,
				eventId:	this.eventId
			}
		).then(event => {
			this.setPlayersFromEventToBinding(event);
		});
	},
	setPlayersFromEventToBinding: function(event) {
		if(event && TeamHelper.isNonTeamSport(event)) {
			this.setNonTeamPlayersToBinding(event);
		} else {
			this.setTeamPlayersFromEventToBinding(event);
		}
	},
	initIsDisplayResultsOnPublic: function(event) {
		if(EventHelper.isInterSchoolsEvent(event)) {
			const settings = event.settings;

			const currentSettingsIndex = settings.findIndex(settings => settings.schoolId === this.props.activeSchoolId);
			if(currentSettingsIndex === -1) {
				settings.push({
					schoolId: this.props.activeSchoolId,
					isDisplayResultsOnPublic: true
				});
			}
		}
	},
	setNonTeamPlayersToBinding: function(event) {
		const binding = this.getDefaultBinding();

		// TODO many player bundles, oh it's soo bad
		binding
			.atomically()
			.set('model.individualsData',			Immutable.fromJS(event.individualsData))
			.set('eventTeams.viewPlayers.players',	Immutable.fromJS(event.individualsData))
			.set('eventTeams.isSync',				Immutable.fromJS(true))
			.commit();

		const playersForTaskTab = event.individualsData.filter(player => player.schoolId === this.props.activeSchoolId);
		this.setPlayersToTaskTabBinding(playersForTaskTab);
	},
	setTeamPlayersFromEventToBinding: function(event) {
		const binding = this.getDefaultBinding();

		const players = event.teamsData.map(tp => tp.players);	// players is Array[Array[Object]]
		// TODO many player bundles, oh it's soo bad
		binding
			.atomically()
			.set('model.teamsData',					Immutable.fromJS(event.teamsData))
			.set('eventTeams.viewPlayers.players',	Immutable.fromJS(players))
			.set('eventTeams.isSync',				Immutable.fromJS(true))
			.commit();

		// playersForTaskTab is Array[Array[Object]]
		const playersForTaskTab = event.teamsData
			.filter(td => td.schoolId === this.props.activeSchoolId)
			.map(tp => tp.players);

		this.setPlayersToTaskTabBinding(playersForTaskTab);
	},
	loadPhotos: function(role) {
		let service;

		switch (role) {
			case RoleHelper.USER_ROLES.PARENT:
				service = window.Server.childEventPhotos;
				break;
			case RoleHelper.USER_ROLES.STUDENT:
				service = window.Server.schoolEventPhotos;
				break;
			default:
				service = window.Server.schoolEventPhotos;
				break;
		}

		return service.get({
			schoolId:	this.props.activeSchoolId,
			eventId:	this.eventId
		},
		{
			filter:
				{
					limit: 100
				}
		});
	},
	/**Init model for Tabs component*/
	initTabs: function() {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				rootBinding	= self.getMoreartyContext().getBinding(),
				tab 		= rootBinding.get('routing.parameters.tab');

		self.tabListModel = [
			{
				value		:'gallery',
				text		:'Gallery',
				isActive	:false
			}
		];

		if(this.props.mode === EventFormConsts.EVENT_FORM_MODE.SCHOOL) {
			self.tabListModel.push({
				value		: 'details',
				text		: 'Details',
				isActive	: false
			});
		}

		if(this.props.mode === EventFormConsts.EVENT_FORM_MODE.SCHOOL) {
			self.tabListModel.push({
				value		: 'tasks',
				text		: 'Jobs',
				isActive	: false
			});
		}

		if(
			self.hasSportPerformanceItems() &&
			this.props.mode === EventFormConsts.EVENT_FORM_MODE.SCHOOL
		) {
			self.tabListModel.push({
				value		: 'performance',
				text		: 'Performance',
				isActive	: false
			});
		}

		if(
			self.hasSportDisciplineItems() &&
			this.props.mode === EventFormConsts.EVENT_FORM_MODE.SCHOOL
		) {
			self.tabListModel.push({
				value		: 'discipline',
				text		: 'Discipline',
				isActive	: false
			});
		}

		self.tabListModel.push(
			{
				value		: 'report',
				text		: 'Match Report',
				isActive	: false
			}
		);

		if(
			this.isShowParentalConsentTab() &&
			this.props.mode === EventFormConsts.EVENT_FORM_MODE.SCHOOL
		) {
			self.tabListModel.push(
				{
					value		: 'parentalConsent',
					text		: 'Parental Consent',
					isActive	: false
				}
			);
		}

		if(
			this.isShowParentalReportsTab() &&
			this.props.mode === EventFormConsts.EVENT_FORM_MODE.SCHOOL
		) {
			self.tabListModel.push(
				{
					value		: 'parentalReports',
					text		: 'Parental/Student Reports',
					isActive	: false
				}
			);
		}

		if(tab) {
			let item = self.tabListModel.find(t => t.value === tab);
			item.isActive = true;
			binding.set('activeTab', tab);
		} else {
			self.tabListModel[0].isActive = true;
			binding.set('activeTab', 'gallery');
		}
	},
	hasSportPerformanceItems: function() {
		const binding = this.getDefaultBinding();

		return binding.toJS('model.sport.performance').length > 0;
	},
	hasSportDisciplineItems: function() {
		const binding = this.getDefaultBinding();

		return binding.toJS('model.sport.discipline').length > 0;
	},
	changeActiveTab:function(value){
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	urlHash	= document.location.hash,
				hash 	= urlHash.indexOf('?') > 0 ? urlHash.substr(0,urlHash.indexOf('?')): urlHash;

		// reload team players when open team tab
		if(value === 'teams') {
			binding.set('eventTeams.isSync', Immutable.fromJS(false));
		}

		binding.set('activeTab', value);

		window.location.hash = hash + '?tab=' + value + '&schoolId=' + this.props.activeSchoolId; //parent get active school id from routing
	},
	getPerformanceTabBinding: function() {
		const binding	= this.getDefaultBinding();

		return {
			default		: binding.sub('performanceTab'),
			eventTeams	: binding.sub('eventTeams'),
			event		: binding.sub('model')
		};
	},
	getDisciplineTabBinding: function() {
		const binding = this.getDefaultBinding();

		return {
			default		: binding.sub('disciplineTab'),
			eventTeams	: binding.sub('eventTeams'),
			event		: binding.sub('model')
		};
	},
	// TODO many player bundles, oh it's soo bad
	/**
	 *
	 * @param {Array.<Array.<Object>>|Array.<Object>} players array of arrays of team players or array of individuals
	 */
	setPlayersToTaskTabBinding: function(players) {
		const binding = this.getDefaultBinding();

		const _players = Lazy(players).flatten().map(player => {
			const copyPlayer = Object.assign({}, player);
			copyPlayer.id = copyPlayer.userId + copyPlayer.permissionId;

			return copyPlayer;
		}).toArray();

		binding.set('tasksTab.players', Immutable.fromJS(_players));
	},
	getTasksTabBinding: function() {
		const binding = this.getDefaultBinding();

		return {
			default:	binding.sub('tasksTab'),
			event:		binding.sub('model')
		};
	},
	getEventTeamsBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return {
			default:					binding.sub('eventTeams'),
			activeTab:					binding.sub('activeTab'),
			event:						binding.sub('model'),
			mode:						binding.sub('mode'),
			individualScoreAvailable:	binding.sub('individualScoreAvailable')
		};
	},
	isShowTrobber: function() {
		const self = this;

		return !self.isSync();
	},
	isSync: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.toJS('sync');
	},
 	isShowMainMode: function() {
		return this.isSync() && !this.isShowChangeTeamMode();
	},
	isShowChangeTeamMode: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return self.isSync() && binding.toJS('mode') === 'edit_squad';
	},
	isaLeftShow:function (activeSchoolId, event, mode) {
		const	isClosingMode	= mode === 'closing',
				params			= isClosingMode && TeamHelper.getParametersForLeftContext(activeSchoolId, event);

		return params && params.bundleName === 'teamsData';
	},
	isaRightShow:function (activeSchoolId, event, mode) {
		const 	isClosingMode 	= mode === 'closing',
				params 			= isClosingMode && TeamHelper.getParametersForRightContext(activeSchoolId, event);

		return params && params.bundleName === 'teamsData';
	},
	/**
	 * Function returns add photo button for gallery tab.
	 */
	getAddPhotoButton: function() {
		const binding = this.getDefaultBinding();

		const	userRole			= RoleHelper.getLoggedInUserRole(this),
				galleryBinding		= binding.sub('gallery'),
				activeSchool		= this.props.activeSchoolId,
				eventId				= this.eventId;

		const isUserCanUploadPhotos	= galleryBinding.toJS('isUserCanUploadPhotos');

		const isLoading				= !galleryBinding.toJS('isSync');

		return (
			<AddPhotoButton	handleChange			= { file => GalleryActions.addPhotoToEvent(userRole, galleryBinding, activeSchool, eventId, file) }
							isUserCanUploadPhotos	= { isUserCanUploadPhotos }
							isLoading				= { isLoading }
						    userRole                = { userRole }
			/>
		);
	},
	handleClickAddTaskButton: function() {
		return this.getDefaultBinding().atomically()
			.set('tasksTab.editingTask',	undefined)
			.set('tasksTab.viewMode',		"ADD")
			.commit();

	},
	/**
	 * Function return add task button for tasks tab.
	 */
	getAddTaskButton: function() {
		if(RoleHelper.getLoggedInUserRole(this) === 'PARENT' || RoleHelper.getLoggedInUserRole(this) === 'STUDENT') {
			return null;
		} else {
			return <Button extraStyleClasses="mAddTask" text="Add job" onClick={this.handleClickAddTaskButton}/>;
		}
	},
	/**
	 * Function returns the active tab.
	 * @returns {*}
	 */
	getActiveTab: function() {
		return this.getDefaultBinding().toJS('activeTab');
	},
	/**
	 * Function returns custom button for tabs.
	 * It depends on the current tab.
	 */
	getCustomButtonForTabs: function() {
		const viewMode = this.getDefaultBinding().toJS('tasksTab.viewMode');

		switch (true) {
			case this.getActiveTab() === "gallery":
				return this.getAddPhotoButton();
			case viewMode === "VIEW" && this.getActiveTab() === "tasks":
				return this.getAddTaskButton();
			default:
				return null;
		}
	},
	isShowMap: function() {
		return this.getDefaultBinding().toJS('model.venue.venueType') !== "TBD";
	},
	removeTeamByRivalId: function(rivalId) {
		const binding = this.getDefaultBinding();

		const	event	= binding.toJS('model'),
				rivals	= binding.toJS('rivals'),
				rival	= rivals.find(rival => rival.id === rivalId);

		return TeamHelper.deleteTeamFromEvent(
			this.props.activeSchoolId,
			event.id,
			rival.team.id
		);
	},
	/**
	 * Function removes individual players from event for current rival
	 * @param rivalId
	 * @returns {Array}
	 */
	removePlayerByRivalId: function(rivalId) {
		const binding = this.getDefaultBinding();

		const rival = binding.toJS('rivals').find(rival => rival.id === rivalId);

		return rival.players.map(p =>
			TeamHelper.deleteIndividualPlayer(
				rival.school.id,
				binding.toJS('model').id,
				p.id
			)
		);
	},
	removeRivalByRivalId: function(rivalId) {
		const rivals = this.getDefaultBinding().toJS('rivals');

		rivals.splice(rivals.findIndex(rival => rival.id === rivalId), 1);

		this.getDefaultBinding().set('rivals', Immutable.fromJS(rivals));
	},
	removeSchoolFromEventBySchoolId: function(schoolId) {
		const event = this.getDefaultBinding().toJS('model');

		return window.Server.schoolEventOpponents.delete(
			{
				schoolId:	this.props.activeSchoolId,
				eventId:	event.id
			}, {
				invitedSchoolIds: [schoolId]
			}
		);
	},
	handleSuccessSubmit: function(updEvent) {
		const binding = this.getDefaultBinding();

		binding.atomically()
			.set("model.startTime",	updEvent.startTime)
			.set("model.venue",		updEvent.venue)
			.commit();

		//TODO I'm going to make event changes without reload.
		this.props.onReload();
	},
	handleClickDeleteButton: function(){
		const 	activeSchoolId 		= this.props.activeSchoolId,
				rootBinding 		= this.getMoreartyContext().getBinding(),
				eventId 			= rootBinding.get('routing.pathParameters.0'),
				binding 			= this.getDefaultBinding(),
				managerGroupChanges = binding.toJS('deleteEvent.managerGroupChanges');
		
		if (managerGroupChanges === EventConsts.CHANGE_MODE.GROUP) {
			EventHeaderActions.deleteGroupEvents(activeSchoolId, eventId).then( () => {
				binding.set("isDeleteEventPopupOpen", false);
				window.simpleAlert(
					'Events has been successfully deleted',
					'Ok',
					() => {
						document.location.hash = 'events/calendar';
					}
				);
			});
		} else {
			EventHeaderActions.deleteEvent(activeSchoolId, eventId).then( () => {
				binding.set("isDeleteEventPopupOpen", false);
				window.simpleAlert(
					'Event has been successfully deleted',
					'Ok',
					() => {
						document.location.hash = 'events/calendar';
					}
				);
			});
		}
	},
	handleCloseEditEventPopup: function() {
		const binding = this.getDefaultBinding();

		binding.set("isEditEventPopupOpen", false);
	},
	handleDeleteEventPopup: function() {
		const binding = this.getDefaultBinding();
		
		binding.set("isDeleteEventPopupOpen", false);
	},
	handleClickRemoveTeamButton: function(rivalId) {
		const	event		= this.getDefaultBinding().toJS('model'),
				rivals		= this.getDefaultBinding().toJS('rivals'),
				rival		= rivals.find(rival => rival.id === rivalId),
				rivalSchool	= rival.school;

		let promises = [];
		const alertMessage = rival.team ?
			`${rival.team.name} from ${rivalSchool.name}` :
			`opponent ${rivalSchool.name}`;

		window.confirmAlert(
			`Are you sure you want to remove ${alertMessage}?`,
			"Ok",
			"Cancel",
			() => {
				// Delete team or individual players
				if(
					(
						TeamHelper.isInterSchoolsEventForTeamSport(event) ||
						TeamHelper.isInternalEventForTeamSport(event)
					) &&
					typeof rival.team !== 'undefined'
				) {
					promises = promises.concat(this.removeTeamByRivalId(rivalId));
				}
				if(TeamHelper.isInterSchoolsEventForIndividualSport(event)) {
					promises = promises.concat(this.removePlayerByRivalId(rivalId));
				}

				const currentSchoolRivals = rivals.filter(rival => rival.school.id === rivalSchool.id);
				if(
					rivalSchool.id !== this.props.activeSchoolId &&
					currentSchoolRivals.length === 1 // remove current rival school if it's last rival for current school
				) {
					promises = promises.concat(this.removeSchoolFromEventBySchoolId(rivalSchool.id));
				}

				Promise.all(promises).then(() => {
					// reload event component
					this.props.onReload();
				});
			},
			() => {}
		);
	},
	handleClickOpponentSchoolManagerButton: function(rivalId) {
		const event = this.getDefaultBinding().toJS(`model`);

		const newValue = !this.getDefaultBinding().get('opponentSchoolManager.isOpen');
		if(newValue) {
			let opponentSchoolId;
			if(TeamHelper.isNewEvent(event)) {
				opponentSchoolId = this.getDefaultBinding().toJS('rivals').find(rival => rival.id === rivalId).school.id;
			} else {
				opponentSchoolId = event.invitedSchoolIds[0];
			}

			this.getDefaultBinding()
				.atomically()
				.set('opponentSchoolManager.isOpen',			newValue)
				.set('opponentSchoolManager.opponentSchoolId',	Immutable.fromJS(opponentSchoolId))
				.set('opponentSchoolManager.mode',				'REPLACE')
				.commit();
		} else {
			this.getDefaultBinding().set('opponentSchoolManager.isOpen', newValue);
		}
	},
	renderEditEventPopupOpen: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		if(binding.get("isEditEventPopupOpen")) {
			return (
				<EditEventPopup	binding				= { binding.sub('editEventPopup') }
								activeSchool		= { this.getDefaultBinding().toJS('activeSchoolInfo') }
								activeSchoolId		= { this.props.activeSchoolId }
								event				= { binding.toJS('model') }
								schoolType			= { this.props.mode }
								handleSuccessSubmit	= { this.handleSuccessSubmit }
								handleClosePopup	= { this.handleCloseEditEventPopup }
				/>
			)
		} else {
			return null;
		}
	},
	isGroupEvent: function () {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model');
		
		return typeof event.groupId !== 'undefined';
	},
	renderDeleteEventPopupBody: function(){
		if (this.isGroupEvent()) {
			return (
				<div>
				<div>Are you sure you want to delete the selected event?</div>
					<ManagerGroupChanges
						onClickRadioButton 	= { this.handleClickRadioButton }
						customStyles 		= { 'eSavePlayerChangesManager' }
					/>
				</div>
			);
		} else {
			return (
				<div>Are you sure you want to delete the selected event?</div>
			);
		}
	},
	handleClickRadioButton: function(mode){
		this.getDefaultBinding().set('deleteEvent.managerGroupChanges', mode);
	},
	renderDeleteEventPopupOpen: function() {
		const binding	= this.getDefaultBinding();
		
		if(binding.get("isDeleteEventPopupOpen")) {
			return (
				<ConfirmPopup	okButtonText			= "Delete"
								cancelButtonText		= "Cancel"
								isOkButtonDisabled		= { false }
								handleClickOkButton		= { this.handleClickDeleteButton }
								handleClickCancelButton	= { this.handleDeleteEventPopup }
				>
					{ this.renderDeleteEventPopupBody() }
				</ConfirmPopup>
			)
		} else {
			return null;
		}
	},
	renderConsentRequestPopupOpen: function() {
		const binding	= this.getDefaultBinding();

		return (
			<Popup
				binding         = { binding }
				stateProperty   = { "isConsentRequestPopupOpen" }
				onRequestClose  = { () => binding.set("isConsentRequestPopupOpen", false) }
				otherClass      = 'bConsentRequestPopup'
			>
				<ConsentRequestPopup
					binding             = { binding.sub('consentRequest') }
					schoolId	        = { this.props.activeSchoolId }
					sendConsent         = { this.handleClickSendConsentRequest }
					handleClickClose    = { this.closeConsentRequestPopup }
				/>
			</Popup>
		)
	},
	closeConsentRequestPopup: function () {
		this.getDefaultBinding().set("isConsentRequestPopupOpen", false);
	},
	handleClickSendConsentRequest: function(fields){
		const 	activeSchoolId 		= this.props.activeSchoolId,
				binding	            = this.getDefaultBinding(),
				rootBinding 		= this.getMoreartyContext().getBinding(),
				eventId 			= rootBinding.get('routing.pathParameters.0');

		EventHeaderActions.sendConsentRequest(activeSchoolId, eventId, fields)
			.then(() => {
				this.closeConsentRequestPopup();
				window.simpleAlert(
					'Consent requests have been successfully sent',
					'Ok',
					() => this.props.onReload()
				);
			});
	},
	renderEditTeamButtons: function() {
		if(TeamHelper.isShowEditEventButton(this, this.props.mode)) {
			return (
				<div className="bEventMiddleSideContainer">
					<div className="bEventMiddleSideContainer_row">
						<EditingTeamsButtons binding={this.getDefaultBinding()}/>
					</div>
				</div>
			);
		} else {
			return null;
		}
	},
	// It's temp function
	renderRivalsStuff: function() {
		const	binding			= this.getDefaultBinding();

		const	event			= binding.toJS('model'),
				mode			= binding.toJS('mode');

		//TODO it's temp. only for event refactoring period.
		if(TeamHelper.isNewEvent(event)) {
			return (
				<Rivals
					key										= { binding.toJS('rivalsComponentKey') }
					binding									= { binding }
					viewMode								= { binding.toJS('viewMode') }
					schoolType								= { this.props.mode }
					activeSchoolId							= { this.props.activeSchoolId }
					isShowControlButtons					= { this.props.isShowControlButtons }
					handleClickOpponentSchoolManagerButton	= { this.handleClickOpponentSchoolManagerButton }
					handleClickRemoveTeamButton				= { this.handleClickRemoveTeamButton }
				/>
			);
		} else {
			return (
				<span>
					{ this.renderSelectWithGameResultForCricket( ) }
					{ this.renderGameResultForCricket() }
					<EventRivals
						binding									= { binding }
						onReload								= { this.props.onReload }
						activeSchoolId							= { this.props.activeSchoolId }
						handleClickChangeOpponentSchoolButton	= { this.handleClickOpponentSchoolManagerButton }
					/>
					{ this.renderEditTeamButtons() }
					<IndividualScoreAvailableBlock
						binding			= { this.getDefaultBinding() }
						activeSchoolId	= { this.props.activeSchoolId }
						mode			= { mode }
						event			= { event }
						schoolType		= { this.props.mode }
					/>
					<EventTeams
						binding			= { this.getEventTeamsBinding() }
						activeSchoolId	= { this.props.activeSchoolId }
					/>
				</span>
			);
		}
	},
	renderOpponentSchoolManager: function() {
		const binding = this.getDefaultBinding();

		const isOpen = binding.toJS('opponentSchoolManager.isOpen');

		if(isOpen) {
			const	opponentSchoolId	= binding.toJS('opponentSchoolManager.opponentSchoolId'),
					mode				= binding.toJS('opponentSchoolManager.mode');

			return (
				<OpponentSchoolManager
					activeSchoolId		= { this.props.activeSchoolId }
					opponentSchoolId	= { opponentSchoolId }
					mode				= { mode }
					schoolType			= { this.props.mode }
					onReload			= { this.props.onReload }
					binding				= { binding }
				/>
			);
		} else {
			return null;
		}
	},
	onChangeCricketResult: function(result){
		const binding = this.getDefaultBinding();

		binding.set('model.results.cricketResult', Immutable.fromJS(result));
	},
	renderGameResultForCricket: function(){
		const 	binding 	= this.getDefaultBinding(),
				mode 		= typeof binding.toJS('mode') !== 'undefined' ? binding.toJS('mode') : '',
				event 		= binding.toJS('model'),
				sportName 	= typeof binding.toJS('model.sport.name') !== 'undefined' ? binding.toJS('model.sport.name').toLowerCase() : '';
		
		if (SportHelper.isCricket(sportName) && mode === 'general') {
			return (
				<CricketResultBlock
					event 			= { event }
					activeSchoolId 	= { this.props.activeSchoolId }
				/>
			);
		} else {
			return null;
		}
	},
	renderSelectWithGameResultForCricket: function(){
		const 	binding 	= this.getDefaultBinding(),
				sportName 	= typeof binding.toJS('model.sport.name').toLowerCase() !== 'undefined' ? binding.toJS('model.sport.name').toLowerCase() : '',
				mode 		= typeof binding.toJS('mode') !== 'undefined' ? binding.toJS('mode') : '',
				event 		= binding.toJS('model');

		if (SportHelper.isCricket(sportName) && mode === 'closing') {
			return (
				<div className="eSelectForCricketWrapper">
					<SelectForCricketWrapper
						event 			= { event }
						onChangeResult 	= { this.onChangeCricketResult }
					/>
				</div>
			);
		} else {
			return null;
		}
	},
	renderPerformance: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		const	event			= binding.toJS('model');

		//TODO it's temp. only for event refactoring period.
		if(TeamHelper.isNewTabs(event)) {
			return (
				<NewPerformance	binding			= { binding }
								activeSchoolId	= { this.props.activeSchoolId }
				/>
			);
		} else {
			return (
				<Performance	binding			= {self.getPerformanceTabBinding()}
								activeSchoolId	= {this.props.activeSchoolId}
				/>
			);
		}
	},
	renderDiscipline: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		const	event			= binding.toJS('model');

		//TODO it's temp. only for event refactoring period.
		if(TeamHelper.isNewTabs(event)) {
			return (
				<NewDiscipline	binding			= { binding }
								activeSchoolId	= { this.props.activeSchoolId }
				/>
			);
		} else {
			return (
				<DisciplineWrapper	binding			= {self.getDisciplineTabBinding()}
									activeSchoolId	= {this.props.activeSchoolId}
				/>
			);
		}
	},
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		const	event			= binding.toJS('model'),
				activeTab		= this.getActiveTab(),
				role			= RoleHelper.getLoggedInUserRole(this),
				point 			= binding.toJS('model.venue.point') && binding.toJS('model.venue.point').coordinates.length>0
					? binding.toJS('model.venue.point') : binding.toJS('model.venue.postcodeData.point'),
				isNewEvent		= binding.get('isNewEvent');

		const EventContainerStyle = classNames({
			bEventContainer	: true,
			mTopMargin		: !isNewEvent
		});

		switch (true) {
			case !self.isSync():
				return (
					<div className="bEventContainer mTopMargin">
						<span className="eEvent_loading">
							Loading...
						</span>
					</div>
				);
			// sync and any mode excluding edit_squad
			case self.isSync() && binding.toJS('mode') !== 'edit_squad':
				return (
					<div className={EventContainerStyle}>
						<If condition={isNewEvent}>
							<CreateOtherEventPanel eventId={event.id}/>
						</If>
						<div className="bEvent">
							<EventHeaderWrapper
								binding			= { binding }
								onReload		= { this.props.onReload }
								activeSchoolId	= { this.props.activeSchoolId }
								mode			= { this.props.mode }
							/>
							{ this.renderRivalsStuff() }
							<If condition={this.isShowMap()}>
								<div className="bEventMap">
									<div className="bEventMap_row">
										<div className="bEventMap_col">
											<Map point={point} />
										</div>
									</div>
								</div>
							</If>
							<div className="bEventMiddleSideContainer">
								<Tabs
									tabListModel	= {self.tabListModel}
									onClick			= {self.changeActiveTab}
									customButton	= {this.getCustomButtonForTabs()}
								/>
							</div>
							<If condition={activeTab === 'performance'} >
								<div className="bEventBottomContainer">
									{ this.renderPerformance() }
								</div>
							</If>
							<If condition={activeTab === 'discipline'} >
								<div className="bEventBottomContainer">
									{ this.renderDiscipline() }
								</div>
							</If>
							<If condition={activeTab === 'tasks'} >
								<div className="bEventBottomContainer">
									<TasksWrapper	binding			= {this.getTasksTabBinding()}
													activeSchoolId	= {this.props.activeSchoolId}
									/>
								</div>
							</If>
							<If condition={activeTab === 'gallery'} >
								<EventGallery	activeSchoolId	= { this.props.activeSchoolId }
												eventId			= { self.eventId }
												binding			= { binding.sub('gallery') } />
							</If>
							<If condition={activeTab === 'details'} >
								<div className="bEventBottomContainer">
									<DetailsWrapper	eventId		= {self.eventId}
													schoolId	= {this.props.activeSchoolId}
													role		= {role}
													event 		= {event}
									/>
									<div className="eDetails_border" />
								</div>
							</If>
							<If condition={activeTab === 'report'} >
								<div className="bEventBottomContainer">
									<MatchReport	binding		= {binding.sub('matchReport')}
													eventId		= {self.eventId}
													role		= {role}
									/>
								</div>
							</If>
							<If condition={activeTab === 'parentalConsent'} >
								<div className="bEventBottomContainer">
									<ParentalConsentTab
										eventId = {self.eventId}
										schoolId = {this.props.activeSchoolId}
										binding = {
											{default: binding.sub('parentalConsentTab'), event: binding.sub('model')}}
									/>
								</div>
							</If>
							<If condition={activeTab === 'parentalReports'} >
								<div className="bEventBottomContainer">
									<ParentalReportsTab
										eventId		= {self.eventId}
										schoolId	= {this.props.activeSchoolId}
										binding		= {binding.sub('parentalReportsTab')}
									/>
								</div>
							</If>
							<div className="eEvent_commentBox">
								<Comments	binding					= {binding.sub('comments')}
											isUserCanWriteComments	= {binding.toJS('isUserCanWriteComments')}
											eventId					= {event.id}
											activeSchoolId			= {this.props.activeSchoolId}
								/>
							</div>
						</div>
						{ this.renderOpponentSchoolManager() }
						{ this.renderEditEventPopupOpen() }
						{ this.renderDeleteEventPopupOpen() }
						{ this.renderConsentRequestPopupOpen() }
					</div>
				);
			// sync and edit squad mode
			case self.isSync() && binding.toJS('mode') === 'edit_squad':
				return (
					<ManagerWrapper	binding			= {binding}
									activeSchoolId	= {this.props.activeSchoolId}
					/>
				);
		}
	}
});

module.exports = Event;