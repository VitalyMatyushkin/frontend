const	If				= require('module/ui/if/if'),
		Tabs			= require('module/ui/tabs/tabs'),
		EventHelper		= require('module/helpers/eventHelper'),
		EventHeader		= require('./view/event_header'),
		EventRivals		= require('./view/event_rivals'),
		EventButtons	= require('./view/event_buttons'),
		EventTeams		= require('./view/teams/event_teams'),
		EventGallery	= require('module/as_manager/pages/event/gallery/event_gallery'),
		EventDetails    = require('./view/event_details'),
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
			teamsData: [],
			eventId: null,
			points: [],
			result: {
				points: []
			},
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
				binding		= self.getDefaultBinding(),
				eventId		= rootBinding.get('routing.pathParameters.0');

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);
		self.initTabs();

		self._initMenuItems();

		let	activeSchool;

		window.Server.school.get(self.activeSchoolId)
		.then(_school => {
			activeSchool = _school;

			// Get forms
			return window.Server.schoolForms.get(self.activeSchoolId, {filter:{limit:1000}});
		})
		.then(forms => {
			activeSchool.forms = forms;

			// Get event
			return window.Server.schoolEvent.get({
				schoolId: self.activeSchoolId,
				eventId: eventId
			});
		})
		.then(event => {
			// TODO remove plug and implement albums
			const	albums	= [], // res.albums,
					points	= event.result && event.result.points ? TeamHelper.convertPointsToClientModel(event.result.points) : [];

			binding
				.atomically()
				.set('sport',				Immutable.fromJS(event.sport))
				.set('model',				Immutable.fromJS(event))
				.set('model.sportModel',	Immutable.fromJS(event.sport))
				.set('teamsData',			Immutable.fromJS(event.teamsData))
				.set('points',				Immutable.fromJS(points))
				.set('albums',				Immutable.fromJS(albums))
				.set('schoolInfo',			Immutable.fromJS(activeSchool))
				.set('eventId',				Immutable.fromJS(eventId))
				.set('mode',				Immutable.fromJS('general'))
				.set('sync',				Immutable.fromJS(true))
				.commit();
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
				value:'details',
				text:'Details',
				isActive:false
			},
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
	_initMenuItems: function() {
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
	_onClickReFormTeamMatch: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('mode', 'edit_squad');
	},
	_getEventTeamsBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return {
			default:	binding.sub('eventTeams'),
			event:		binding.sub('model'),
			points:		binding.sub('points'),
			schoolInfo:	binding.sub('schoolInfo'),
			mode:		binding.sub('mode')
		};
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
					<If condition={binding.get('sync')=== true}>
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
									<If condition={EventHelper._isShowEditEventButton(self)}>
										<div className="bEditButtonWrapper">
											<div
												className="bEditButton"
												onClick={self._onClickReFormTeamMatch}
											>
												<SVG icon="icon_edit"/>
											</div>
										</div>
									</If>
								</div>
							</div>
							<If condition={activeTab === 'teams'} >
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
								<div>
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
					<If condition={!binding.get('sync')}>
						<span>loading...</span>
					</If>
				</div>
			</div>
		);
	}
});

module.exports = EventView;