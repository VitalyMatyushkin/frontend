const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),

		If					= require('module/ui/if/if'),
		Tabs				= require('module/ui/tabs/tabs'),
		EventHeader			= require('./view/event_header'),
		EventRivals			= require('./view/event_rivals'),
		EventButtons		= require('./view/event_buttons'),
		EventTeams			= require('./view/teams/event_teams'),
		EventGallery		= require('./new_gallery/event_gallery'),
		EventDetails		= require('./view/event_details'),
		ManagerWrapper		= require('./view/manager_wrapper'),
		Comments			= require('./view/event_blog'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		EventResultHelper	= require('./../../../helpers/event_result_helper'),
		MatchReport 		= require('module/as_manager/pages/event/view/match-report/report'),
		SVG 				= require('module/ui/svg');

const EventView = React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'EventPage',
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			model:			{},
			gallery:		{
				photos:		[],
				isUploading:false,
				isSync:		false
			},
			sync:			false,
			mode:			'general',
			showingComment:	false,
			activeTab:		'teams',
			eventTeams:		{}
		});
	},
	componentWillMount: function () {
		const 	self 		= this,
				rootBinding = self.getMoreartyContext().getBinding(),
				binding 	= self.getDefaultBinding();

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);
		self.eventId = rootBinding.get('routing.pathParameters.0');

		self.initTabs();

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

			return this.loadPhotos();
		}).then(photos => {
			eventData.matchReport = report.content;

			binding.atomically()
				.set('model',			Immutable.fromJS(eventData))
				.set('gallery.photos',	Immutable.fromJS(photos))
				.set('gallery.isSync',	true)
				.set('mode',			Immutable.fromJS('general'))
				.set('sync',			Immutable.fromJS(true))
				.commit();

			return eventData;
		})
	},
	loadPhotos: function() {
		return window.Server.schoolEventPhotos.get({
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
				value:'teams',
				text:'Teams',
				isActive:false
			},
			{
				value:'performance',
				text:'Performance',
				isActive:false
			},
			//{
			//	value:'details',
			//	text:'Details',
			//	isActive:false
			//},
			{
				value:'gallery',
				text:'Gallery',
				isActive:false
			},
			{
				value:'comments',
				text:'Comments',
				isActive:false
			},
			{
				value:'report',
				text:'Match Report',
				isActive:false
			}
		];

		if(tab) {
			let item = self.tabListModel.find(t => t.value === tab);
			item.isActive = true;
			binding.set('activeTab', tab);
		} else {
			self.tabListModel[0].isActive = true;
			binding.set('activeTab', 'teams');
		}
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
			default:	binding.sub('eventTeams'),
			activeTab:	binding.sub('activeTab'),
			event:		binding.sub('model'),
			mode:		binding.sub('mode')
		};
	},
	isShowTrobber: function() {
		const self = this;

		return !self.isSync();
	},
	isSync: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.toJS('sync')=== true;
	},
 	isShowMainMode: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return self.isSync() && !self.isShowChangeTeamMode();
	},
	isShowChangeTeamMode: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return self.isSync()  && binding.toJS('mode') === 'edit_squad';
	},
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				showingComment	= binding.get('showingComment'),
				activeTab		= binding.get('activeTab');

		return (
			<div>
				<div className="bEventContainer">
					<If condition={self.isShowTrobber()}>
						<span>loading...</span>
					</If>
					<If condition={self.isShowMainMode()}>
						<div className="bEvent">
							<div className="bEventHeader_wrap">
								<EventHeader binding={binding}/>
								<EventRivals binding={binding}/>
							</div>
							<div className="bEventMiddleSideContainer">
								<div className="bEventMiddleSideContainer_leftSide">
									<Tabs tabListModel={self.tabListModel} onClick={self.changeActiveTab} />
								</div>
								<div className="bEventMiddleSideContainer_rightSide">
									<If condition={TeamHelper.isShowEditEventButton(self)}>
										<div className="bEditButtonWrapper">
											<div
												className="bEditButton"
												onClick={self.handleClickChangeTeamsButtons}
											>
												<SVG icon="icon_edit"/>
											</div>
										</div>
									</If>
								</div>
							</div>
							<If condition={activeTab === 'teams' || activeTab === 'performance'} >
								<EventTeams binding={self._getEventTeamsBinding()} />
							</If>
							<If condition={activeTab === 'details'} >
								<EventDetails binding={binding}/>
							</If>
							<If condition={activeTab === 'gallery'} >
								<EventGallery	activeSchoolId	= { self.activeSchoolId }
												eventId			= { self.eventId }
												binding			= { binding.sub('gallery') } />
							</If>
							<If condition={activeTab === 'comments'} >
								<div className="eEvent_commentBox">
									<Comments binding={binding}/>
								</div>
							</If>
							<If condition={activeTab === 'report'} >
								<div className="bEventBottomContainer">
									<MatchReport binding={binding} eventId={self.eventId} />
								</div>
							</If>
							<If condition={(binding.get('mode') !== 'general')}>
								<EventButtons binding={binding} />
							</If>
						</div>
					</If>
					<If condition={self.isShowChangeTeamMode()}>
						<div>
							<ManagerWrapper binding={binding} />
							<EventButtons binding={binding} />
						</div>
					</If>
				</div>
			</div>
		);
	}
});

module.exports = EventView;