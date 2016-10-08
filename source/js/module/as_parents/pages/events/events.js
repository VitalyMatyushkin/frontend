const   RouterView  				= require('module/core/router'),
		Route       				= require('module/core/route'),
		React       				= require('react'),
		SubMenu     				= require('module/ui/menu/sub_menu'),
		Morearty        			= require('morearty'),
		Immutable   				= require('immutable'),
		EventsCalendarComponent 	= require('module/as_parents/pages/events/events_calendar'),
		EventsFixturesComponent 	= require('module/ui/fixtures/events_fixtures'),
		EventsAchievementComponent 	= require("module/as_parents/pages/events/events_achievement");

const EventView = React.createClass({
	mixins: [Morearty.Mixin],
	activeSchoolId: undefined,
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			eventsRouting: {},
			children:[],
			teams: [],
			sports: {
				models: [],
				sync: false
			},
			eventsOfAllChildren:[],
			models: [],
			sync: false,
			newEvent: {},
			achievements:null
		});
	},
	componentWillMount: function () {
		this.getChildren();
		this.setActiveChild();
	},
	componentDidMount:function(){
		const 	self 	= this,
				binding = self.getDefaultBinding();

		self.addBindingListener(binding, 'children', self.createSubMenu);
		self.addBindingListener(binding, 'eventsRouting.currentPathParts', self.createSubMenu);
		self.addBindingListener(binding, 'eventsRouting', self.setActiveChild);
	},
	setActiveChild: function() {
		const self = this,
			binding = self.getDefaultBinding(),
			rootBinding = self.getMoreartyContext().getBinding(),
			params = rootBinding.toJS('routing.pathParameters'),
			newValue = params && params.length > 0 ? params[0]:'all';

		binding.set('activeChildId', newValue);
	},
	createSubMenu: function(){
		const self = this,
			binding = self.getDefaultBinding(),
			children = binding.toJS('children'),
			partPath = binding.toJS('eventsRouting.currentPathParts'),
			mainMenuItem = partPath && partPath.length > 1 ? '/#' + partPath[0] + '/' + partPath[1] : '',
			menuItems = [];

		children.forEach(user => {
			menuItems.push({
				icon: user.gender === 'female' ? 'icon_girl':'icon_boy',
				href: mainMenuItem + '/' + user.id,
				name: user.firstName + ' ' + user.lastName,
				key: user.id
			});
		});
		if (children.length > 1) {
			menuItems.push({
				icon: 'icon_girl_boy',
				href: mainMenuItem + '/all',
				name: 'Show all children',
				key: 'all',
				className: 'allChildren'
			});
		}
		binding.set('itemsBinding', Immutable.fromJS(menuItems));
	},
	getChildren: function () {
		const	self = this,
				binding = self.getDefaultBinding();

		return window.Server.children.get()
			.then(children => {
				const ids = children.map(c => c.id);

				binding.atomically()
					.set('children',Immutable.fromJS(children))
					.set('childrenIds',Immutable.fromJS(ids))
					.commit();

				return true;
			});
	},
	render: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			rootBinging = self.getMoreartyContext().getBinding();

		return <div className="bParentsPage">
			<SubMenu items={self.menuItems}
					binding={{
						default: binding.sub('eventsRouting'),
						itemsBinding: binding.sub('itemsBinding')
					}}/>

			<div className='bSchoolMaster'>
				<div className='bEvents'>
					<RouterView routes={binding.sub('eventsRouting')}
								binding={rootBinging}>
						<Route	path='/events/calendar/:userId'
								binding={binding}
								component={EventsCalendarComponent}/>

						<Route	path='/events/fixtures/:userId'
								binding={
										{
											default: binding.sub('fixtures'),
											calendar: binding.sub('calendar')
										}
                                    }
								component={EventsFixturesComponent}/>

						<Route	path="/events/achievement/:userId"
								binding={binding}
								component={EventsAchievementComponent}/>
					</RouterView>
				</div>
			</div>
		</div>;
	}
});


module.exports = EventView;
