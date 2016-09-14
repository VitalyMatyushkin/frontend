const	If				= require('module/ui/if/if'),
		Tabs			= require('module/ui/tabs/tabs'),
		EventHelper		= require('module/helpers/eventHelper'),
		EventHeader		= require('./view/event_header'),
		EventRivals		= require('./view/event_rivals'),
		EventButtons	= require('./view/event_buttons'),
		EventTeams		= require('./view/teams/event_teams'),
		EventGallery	= require('module/as_manager/pages/event/gallery/event_gallery'),
		EventDetails	= require('./view/event_details'),
		ManagerWrapper	= require('./view/manager_wrapper'),
		React			= require('react'),
		Comments		= require('./view/event_blog'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		SVG 			= require('module/ui/svg'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty');

const EventView = React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'EventPage',
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			model: {},
			sync: false,
			mode: 'general',
			showingComment: false,
			activeTab:'teams',
			eventTeams: {}
		});
	},
	componentWillMount: function () {
		const	self		= this,
				rootBinding	= self.getMoreartyContext().getBinding(),
				binding		= self.getDefaultBinding();
		
		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);
		
		self.initTabs();
		self.initMenuItems();

		window.Server.schoolEvent.get({
				schoolId:	self.activeSchoolId,
				eventId:	rootBinding.get('routing.pathParameters.0')
		}).then(event => {
			event.schoolsData = TeamHelper.getSchoolsData(event);
			event.teamsData = event.teamsData.sort((t1, t2) => {
				if(t1.name < t2.name) {
					return -1;
				}
				if(t1.name > t2.name) {
					return 1;
				}
				if(t1.name === t2.name) {
					return 0;
				}
			});
			event.housesData = event.housesData.sort((h1, h2) => {
				if(h1.name < h2.name) {
					return -1;
				}
				if(h1.name > h2.name) {
					return 1;
				}
				if(h1.name === h2.name) {
					return 0;
				}
			});
			// FUNCTION MODIFY EVENT OBJECT!!
			self.initializeEventResults(event);

			binding
				.atomically()
				.set('model',	Immutable.fromJS(event))
				.set('albums',	Immutable.fromJS([]))
				.set('mode',	Immutable.fromJS('general'))
				.set('sync',	Immutable.fromJS(true))
				.commit();

			return event;
		})
	},
	/**
	 * !! Function modify event object !!
	 * Initialize event results.
	 * It means:
	 * 1) Set zero points to appropriate score bundle(schools score, teams score, houses score and etc.)
	 * 2) Backup init state of results for revert changes in scores if it will be need.
	 * @param event
	 */
	initializeEventResults: function(event) {
		const self = this;

		if(TeamHelper.isTeamSport(event) || TeamHelper.isOneOnOneSport(event)) {
			event.results = TeamHelper.callFunctionForLeftContext(
				self.activeSchoolId,
				event,
				self.getInitResults.bind(self, event)
			);
			event.results = TeamHelper.callFunctionForRightContext(
				self.activeSchoolId,
				event,
				self.getInitResults.bind(self, event)
			);
		}
		// backup results
		// we need default state of results for revert event result changes
		// when user click to cancel button(in close event mode)
		event.initResults = event.results;
	},
	getInitResults: function(event, teamBundleName, order) {
		const self = this;

		let	scoreBundleName,
			resultIdFieldName,
			dataBundleIdFieldName,
			dataBundle;

		switch (teamBundleName) {
			case 'schoolsData':
				scoreBundleName			= 'schoolScore';
				resultIdFieldName		= 'schoolId';
				dataBundleIdFieldName	= 'id';
				dataBundle				= event[teamBundleName];
				break;
			case 'housesData':
				scoreBundleName			= 'houseScore';
				resultIdFieldName		= 'houseId';
				dataBundleIdFieldName	= 'id';
				dataBundle				= event[teamBundleName];
				break;
			case 'teamsData':
				scoreBundleName			= 'teamScore';
				resultIdFieldName		= 'teamId';
				dataBundleIdFieldName	= 'id';
				dataBundle				= event[teamBundleName];
				break;
			case 'individualsData':
				scoreBundleName			= 'individualScore';
				resultIdFieldName		= 'userId';
				dataBundleIdFieldName	= 'userId';
				dataBundle				= event.individualsData;
				break;
		}

		if(typeof dataBundle[order] !== 'undefined') {
			const scoreData = event.results[scoreBundleName].find(r => r[resultIdFieldName] === dataBundle[order][dataBundleIdFieldName]);

			if(typeof scoreData === 'undefined') {
				const newScoreData = {};
				newScoreData[resultIdFieldName]	= dataBundle[order][dataBundleIdFieldName];
				newScoreData.score				= 0;
				if(teamBundleName === 'individualsData') {
					newScoreData.permissionId = dataBundle[order].permissionId;
				}

				event.results[scoreBundleName].push(newScoreData);
			}
		}

		return event.results;
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
	/**
	 * Initialize data for menu items
	 * @private
	 */
	initMenuItems: function() {
		const	self	= this,
				eventId	= self.getMoreartyContext().getBinding().get('routing.pathParameters.0');

		self.menuItems = [
			{
				href: '/#event/' + eventId,
				name: 'General',
				key: 'General'
			},{
				href: '/#event/' + eventId + '/edit',
				name: 'Edit',
				key: 'Edit'
			},
			{
				href: '/#event/' + eventId + '/finish',
				name: 'Finish',
				key: 'Finish'
			}
		];
	},
	//A function that shadows comment keystrokes in order to show the comments right after the manager has entered them
	//This avoids the manager having to reload the screen to see what they just entered.
	onChange:function(){
		const	self	= this,
				comment	= document.getElementById('commentTextArea');

		if(comment){
			self.commentContent = comment.value;
		}else{
			self.commentContent = '0';
		}
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

		self.onChange();

		return (
			<div>
				<div className="bEventContainer">
					<If condition={self.isShowTrobber()}>
						<span>loading...</span>
					</If>
					<If condition={self.isShowMainMode()}>
						<div className="bEvent">
							<If condition={(binding.get('mode') === 'general')}>
								<div className="bEventButtons_action">
									<EventButtons binding={binding} />
								</div>
							</If>
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
								<EventGallery binding={binding} />
							</If>
							<If condition={activeTab === 'comments'} >
								<div className="eEvent_commentBox">
									<Comments binding={binding}/>
								</div>
							</If>
							<If condition={activeTab === 'report'} >
								<div className="bEventBottomContainer">
									<If condition={(binding.get('mode') === 'general') && (self.commentContent !=='0')}>
										<div className="eEvent_shadowCommentText">{self.commentContent}</div>
									</If>
									<div>
										<If condition={binding.get('mode') === 'closing'}>
											<Morearty.DOM.textarea
												placeholder="Enter your first comment"
												className="eEvent_comment"
												onChange={Morearty.Callback.set(binding, 'model.comment')}
												value={binding.get('model.comment')} id="commentTextArea"
											/>
										</If>
										<If condition={binding.get('mode') === 'general' && binding.get('model.result.comment')!==undefined}>
											<div className="bMainComment">
												<div>{binding.get('model.result.comment')}</div>
											</div>
										</If>
									</div>
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