const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),

		If							= require('module/ui/if/if'),
		Tabs						= require('./../../../ui/tabs/tabs'),
		EventHeader					= require('./view/event_header'),
		EventRivals					= require('./view/event_rivals'),
		EventButtons				= require('./view/event_buttons'),
		IndividualScoreAvailable	= require('./view/individual_score_available'),
		EventTeams					= require('./view/teams/event_teams'),
		EventPerformance			= require('./view/teams/event_teams_performance'),
		EventGallery				= require('./new_gallery/event_gallery'),
		EventDetails				= require('./view/event_details'),
		ManagerWrapper				= require('./view/manager_wrapper'),
		Comments					= require('./view/event_blog'),
		MoreartyHelper				= require('module/helpers/morearty_helper'),
		TeamHelper					= require('module/ui/managers/helpers/team_helper'),
		EventResultHelper			= require('./../../../helpers/event_result_helper'),
		DetailsWrapper 				= require('./view/details/details_wrapper'),
		MatchReport 				= require('./view/match-report/report'),
		SportConsts					= require('module/helpers/consts/sport'),
		Map 						= require('module/ui/map/map-event-venue'),
		SVG 						= require('module/ui/svg'),

		RoleHelper					= require('./../../../helpers/role_helper');

const EventPage = React.createClass({
	mixins: [Morearty.Mixin],
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
		const 	self 		= this,
				rootBinding = self.getMoreartyContext().getBinding(),
				binding 	= self.getDefaultBinding();

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);
		self.eventId = rootBinding.get('routing.pathParameters.0');

		let eventData, report;
		window.Server.schoolEvent.get({
			schoolId: self.activeSchoolId,
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
				schoolId: self.activeSchoolId,
				eventId: self.eventId
			});
		}).then(_report => {
			report = _report;

			return this.loadPhotos(RoleHelper.getLoggedInUserRole(this));
		}).then(photos => {
			eventData.matchReport = report.content;

			binding.atomically()
				.set('model',			Immutable.fromJS(eventData))
				.set('gallery.photos',	Immutable.fromJS(photos))
				.set('gallery.isSync',	true)
				.set('mode',			Immutable.fromJS('general'))
				.commit();

			self.initTabs();

			binding.set('sync', Immutable.fromJS(true));

			return eventData;
		})
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
			schoolId:	this.activeSchoolId,
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

		self.tabListModel.push(
			{
				value		: 'details',
				text		: 'Details',
				isActive	: false
			}, {
				value		: 'report',
				text		: 'Match Report',
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
	handleClickChangeTeamsButtons: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('mode', 'edit_squad');
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
	render: function() {
		const	self						= this,
				binding						= self.getDefaultBinding();

		const	event						= binding.toJS('model'),
				showingComment				= binding.get('showingComment'),
				activeTab					= binding.get('activeTab'),
				activeSchoolId				= MoreartyHelper.getActiveSchoolId(this),
				mode						= binding.toJS('mode'),
				isaLeftShow					= this.isaLeftShow(activeSchoolId, event, mode),
				isaRightShow				= this.isaRightShow(activeSchoolId, event, mode),
				isParent					= RoleHelper.isParent(this);

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
							<EventHeader binding={binding}/>
							<EventRivals binding={binding}/>
							<div className="bEventMiddleSideContainer">
								<div className="bEventMiddleSideContainer_row">
									<div className="bEventMiddleSideContainer_buttons">
										<If condition={TeamHelper.isShowEditEventButton(self)}>
											<div className="bButton mCircle"
												 onClick={self.handleClickChangeTeamsButtons}
												>
												<i className="fa fa-pencil" aria-hidden="true"/>
											</div>
										</If>
									</div>
									<IndividualScoreAvailable binding={binding.sub('individualScoreAvailable.0')}
															  isVisible={isaLeftShow}
															  className="mLeft"/>
									<IndividualScoreAvailable binding={binding.sub('individualScoreAvailable.1')}
															  isVisible={isaRightShow}/>
								</div>
							</div>
							<EventTeams binding={self._getEventTeamsBinding()} />
							<div className="bEventMap">
								<div className="bEventMap_row">
									<div className="bEventMap_col">
										<Map binding={binding.sub('mapOfEventVenue')} venue={binding.toJS('model.venue')}/>
									</div>
								</div>
							</div>
							<div className="bEventMiddleSideContainer">
								<Tabs tabListModel={self.tabListModel} onClick={self.changeActiveTab} />
							</div>
							<If condition={activeTab === 'performance'} >
								<div className="bEventBottomContainer">
									<EventPerformance binding={self._getEventTeamsBinding()}/>
								</div>
							</If>
							<If condition={activeTab === 'gallery'} >
								<EventGallery	activeSchoolId	= { self.activeSchoolId }
												eventId			= { self.eventId }
												binding			= { binding.sub('gallery') } />
							</If>
							<If condition={activeTab === 'details'} >
								<div className="bEventBottomContainer">
									<DetailsWrapper	eventId		= {self.eventId}
													schoolId	= {self.activeSchoolId}
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
								<Comments binding={binding}/>
							</div>
						</div>
					</div>
				);
			// sync and edit squad mode
			case self.isSync() && binding.toJS('mode') === 'edit_squad':
				return (
					<div className="bEventContainer">
						<div>
							<ManagerWrapper binding={binding}/>
							<EventButtons binding={binding}/>
						</div>
					</div>
				);
		}
	}
});

module.exports = EventPage;
