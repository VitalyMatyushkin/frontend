const	React						= require('react'),
		Morearty					= require('morearty'),
		Immutable					= require('immutable'),

		If							= require('module/ui/if/if'),
		Tabs						= require('./../../../ui/tabs/tabs'),
		EventHeader					= require('./view/event_header'),
		EventRivals					= require('./view/event_rivals'),
		IndividualScoreAvailable	= require('./view/individual_score_available'),
		EditingTeamsButtons 		= require('./view/editing_teams_buttons'),
		EventTeams					= require('./view/teams/event_teams'),
		EventPerformance			= require('./view/teams/event_teams_performance'),
		DisciplineWrapper			= require('./view/discipline/discipline_wrapper'),
		TasksWrapper				= require('./view/tasks/tasks_wrapper'),
		EventGallery				= require('./new_gallery/event_gallery'),
		ManagerWrapper				= require('./view/manager_wrapper'),
		Comments					= require('./view/event_blog'),
		TeamHelper					= require('module/ui/managers/helpers/team_helper'),
		EventResultHelper			= require('./../../../helpers/event_result_helper'),
		DetailsWrapper				= require('./view/details/details_wrapper'),
		MatchReport					= require('./view/match-report/report'),
		Map							= require('../../../ui/map/map-event-venue'),

		GalleryActions				= require('./new_gallery/event_gallery_actions'),
		AddPhotoButton				= require('../../../ui/new_gallery/add_photo_button'),

		RoleHelper					= require('./../../../helpers/role_helper');

const Event = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			model: {},
			gallery: {
				photos: [],
				isUploading: false,
				isSync: false
			},
			sync: false,
			mode: 'general',
			showingComment: false,
			activeTab: 'teams',
			eventTeams: {},
			individualScoreAvailable: [
				{
					value: true
				},
				{
					value: true
				}
			]
		});
	},
	componentWillMount: function () {
		const	self		= this,
				rootBinding	= self.getMoreartyContext().getBinding(),
				binding		= self.getDefaultBinding();

		self.eventId = rootBinding.get('routing.pathParameters.0');

		let eventData, report, photos;
		window.Server.schoolEvent.get({
			schoolId: this.props.activeSchoolId,
			eventId: self.eventId
		}).then(event => {
			event.schoolsData = TeamHelper.getSchoolsData(event);
			event.teamsData = event.teamsData.sort((t1, t2) => {
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
			event.housesData = event.housesData.sort((h1, h2) => {
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
			EventResultHelper.initializeEventResults(event);

			eventData = event;

			// loading match report
			return window.Server.schoolEventReport.get({
				schoolId: this.props.activeSchoolId,
				eventId: self.eventId
			});
		}).then(_report => {
			report = _report;

			return this.loadPhotos(RoleHelper.getLoggedInUserRole(this));
		}).then(_photos => {
			photos = _photos;

			return window.Server.schoolSettings.get({schoolId: this.props.activeSchoolId});
		}).then(settings => {
			eventData.matchReport = report.content;

			this.setPlayersFromEventToBinding(eventData);
			binding.atomically()
				.set('model',							Immutable.fromJS(eventData))
				.set('gallery.photos',					Immutable.fromJS(photos))
				.set('gallery.isUserCanUploadPhotos',	Immutable.fromJS(settings.photosEnabled))
				.set('gallery.isSync',					true)
				.set('isUserCanWriteComments',			Immutable.fromJS(settings.commentsEnabled))
				.set('mode',							Immutable.fromJS('general'))
				.commit();

			self.initTabs();

			binding.set('sync', Immutable.fromJS(true));

			this.addListeners();

			return eventData;
		});
	},
	addListeners: function() {
		this.addListenerToEventTeams();
	},
	addListenerToEventTeams: function() {
		const binding = this.getDefaultBinding();

		// reload players from server if isSync is false.
		binding.sub('eventTeams.isSync').addListener(descriptor => !descriptor.getCurrentValue() && this.loadPlayers());
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
	setNonTeamPlayersToBinding: function(event) {
		const binding = this.getDefaultBinding();

		binding
			.atomically()
			.set('model.individualsData',			Immutable.fromJS(event.individualsData))
			.set('eventTeams.viewPlayers.players',	Immutable.fromJS(event.individualsData))
			.set('eventTeams.isSync',				Immutable.fromJS(true))
			.commit();
	},
	setTeamPlayersFromEventToBinding: function(event) {
		const binding = this.getDefaultBinding();

		binding
			.atomically()
			.set('model.teamsData',					Immutable.fromJS(event.teamsData))
			.set('eventTeams.viewPlayers.players',	Immutable.fromJS(event.teamsData.map(tp => tp.players)))
			.set('eventTeams.isSync',				Immutable.fromJS(true))
			.commit();
	},
	loadPhotos: function(role) {
		let service;

		switch (role) {
			case RoleHelper.ALLOWED_PERMISSION_PRESETS.PARENT:
				service = window.Server.childEventPhotos;
				break;
			default:
				service = window.Server.schoolEventPhotos;
				break;
		}

		return service.get({
			schoolId:	this.props.activeSchoolId,
			eventId:	this.eventId
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

		if(self.hasSportPerformanceItems()) {
			self.tabListModel.push({
				value		: 'performance',
				text		: 'Performance',
				isActive	: false
			});
		}

		if(self.hasSportDisciplineItems()) {
			self.tabListModel.push({
				value		: 'discipline',
				text		: 'Discipline',
				isActive	: false
			});
		}

		self.tabListModel.push(
			{
				value		: 'details',
				text		: 'Details',
				isActive	: false
			}, {
				value		: 'report',
				text		: 'Match Report',
				isActive	: false
			}, {
				value		: 'tasks',
				text		: 'Tasks',
				isActive	: false
			}
		);

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

		window.location.hash = hash + '?tab=' + value;
	},
	_getEventTeamsBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return {
			default:					binding.sub('eventTeams'),
			activeTab:					binding.sub('activeTab'),
			event:						binding.sub('model'),
			mode:						binding.sub('mode'),
			individualScoreAvailable: 	binding.sub('individualScoreAvailable')
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
		const 	isClosingMode 	= mode === 'closing',
				params 			= isClosingMode && TeamHelper.getParametersForLeftContext(activeSchoolId, event);

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
			/>
		);
	},
	/**
	 * Function return add task button for tasks tab.
	 * @returns {undefined}
	 */
	getAddTaskButton: function() {
		return undefined;
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
		switch (this.getActiveTab()) {
			case "gallery":
				return this.getAddPhotoButton();
			case "tasks":
				return this.getAddTaskButton();
			default:
				return null;
		}
	},
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		const	event			= binding.toJS('model'),
				showingComment	= binding.get('showingComment'),
				activeTab		= this.getActiveTab(),
				mode			= binding.toJS('mode'),
				isaLeftShow		= this.isaLeftShow(this.props.activeSchoolId, event, mode),
				isaRightShow	= this.isaRightShow(this.props.activeSchoolId, event, mode),
				isParent		= RoleHelper.isParent(this);

		switch (true) {
			case !self.isSync():
				return (
					<div className="bEventContainer">
						<span className="eEvent_loading">loading...</span>
					</div>
				);
			// sync and any mode excluding edit_squad
			case self.isSync() && binding.toJS('mode') !== 'edit_squad':
				return (
					<div className="bEventContainer">
						<div className="bEvent">
							<EventHeader	binding			= {binding}
											activeSchoolId	= {this.props.activeSchoolId}
							/>
							<EventRivals	binding			= {binding}
											activeSchoolId	= {this.props.activeSchoolId}
							/>
							<div className="bEventMiddleSideContainer">
								<div className="bEventMiddleSideContainer_row">
									<EditingTeamsButtons binding={binding} />
									<IndividualScoreAvailable binding={binding.sub('individualScoreAvailable.0')}
															  isVisible={isaLeftShow}
															  className="mLeft"/>
									<IndividualScoreAvailable binding={binding.sub('individualScoreAvailable.1')}
															  isVisible={isaRightShow}/>
								</div>
							</div>
							<EventTeams	binding			= {self._getEventTeamsBinding()}
										activeSchoolId	= {this.props.activeSchoolId}
							/>
							<div className="bEventMap">
								<div className="bEventMap_row">
									<div className="bEventMap_col">
										<Map	binding	= {binding.sub('mapOfEventVenue')}
												venue	= {binding.toJS('model.venue')}
										/>
									</div>
								</div>
							</div>
							<div className="bEventMiddleSideContainer">
								<Tabs	tabListModel	= {self.tabListModel}
										onClick			= {self.changeActiveTab}
										customButton	= {this.getCustomButtonForTabs()}
								/>
							</div>
							<If condition={activeTab === 'performance'} >
								<div className="bEventBottomContainer">
									<EventPerformance binding={self._getEventTeamsBinding()}/>
								</div>
							</If>
							<If condition={activeTab === 'discipline'} >
								<div className="bEventBottomContainer">
									<DisciplineWrapper	binding			= {self._getEventTeamsBinding()}
														activeSchoolId	= {this.props.activeSchoolId}
									/>
								</div>
							</If>
							<If condition={activeTab === 'tasks'} >
								<div className="bEventBottomContainer">
									<TasksWrapper	binding			= {self._getEventTeamsBinding()}
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
													isParent	= {isParent}
									/>
								</div>
							</If>
							<If condition={activeTab === 'report'} >
								<div className="bEventBottomContainer">
									<MatchReport	binding		= {binding.sub('matchReport')}
													eventId		= {self.eventId}
													isParent	= {isParent}
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
					</div>
				);
			// sync and edit squad mode
			case self.isSync() && binding.toJS('mode') === 'edit_squad':
				return (
					<div className="bEventContainer">
						<ManagerWrapper	binding			= {binding}
										activeSchoolId	= {this.props.activeSchoolId}
						/>
					</div>
				);
		}
	}
});

module.exports = Event;