const	React						= require('react'),
		Morearty					= require('morearty'),
		Immutable					= require('immutable'),

		RouterView					= require('module/core/router'),
		Route						= require('module/core/route'),
		{SubMenu}					= require('module/ui/menu/sub_menu'),

		EventsFixturesComponent		    = require('./events_fixtures'),
		EventsCalendarComponent		    = require('./events_calendar'),
		{EventsAchievementComponent}    = require('./events_achievement');

const EventView = React.createClass({
	mixins: [Morearty.Mixin],
	activeSchoolId: undefined,
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			eventsRouting: {},
			school:[],
			schoolIds:[],
			teams: [],
			sports: {
				models: [],
				sync: false
			},
			models: [],
			sync: false,
			achievements:null
		});
	},
	componentWillMount: function () {
		this.getSchool();
		this.setActiveSchool();
	},
	componentDidMount:function(){
		const 	binding = this.getDefaultBinding();

		this.addBindingListener(binding, 'school', this.createSubMenu);
		this.addBindingListener(binding, 'eventsRouting.currentPathParts', this.createSubMenu);
		this.addBindingListener(binding, 'eventsRouting', this.setActiveSchool);
	},
	setActiveSchool: function() {
		const 	binding 		= this.getDefaultBinding(),
				rootBinding 	= this.getMoreartyContext().getBinding(),
				params 			= rootBinding.toJS('routing.pathParameters'),
				newValue 		= params && params.length > 0 ? params[0]:'all';

		binding.set('activeSchoolId', newValue);
	},
	createSubMenu: function(){
		const 	binding 		= this.getDefaultBinding(),
				school 			= binding.toJS('school'),
				partPath 		= binding.toJS('eventsRouting.currentPathParts'),
				mainMenuItem 	= partPath && partPath.length > 1 ? '/#' + partPath[0] + '/' + partPath[1] : '',
				menuItems 		= [];

		school.forEach(sch => {
			menuItems.push({
				icon: 'icon_office',
				href: mainMenuItem + '/' + sch.id,
				name: sch.name,
				key: sch.id
			});
		});

		if (school.length > 1) {
			menuItems.push({
				icon: 'icon_office',
				href: mainMenuItem + '/all',
				name: 'Show all schools',
				key: 'all'
			});
		}

		binding.set('itemsBinding', Immutable.fromJS(menuItems));
	},
	getSchool: function () {
		const	binding = this.getDefaultBinding();

		return window.Server.schools.get()
			.then(school => {
				const ids = school.map(sch => sch.id);


				binding.atomically()
					.set('school', Immutable.fromJS(school))
					.set('schoolIds', Immutable.fromJS(ids))
					.commit();

				return true;
			});
	},
	render: function () {
		const 	binding 		= this.getDefaultBinding(),
				rootBinging 	= this.getMoreartyContext().getBinding();

		return <div className="bParentsPage">
			<SubMenu items={this.menuItems}
					binding={{
						default: binding.sub('eventsRouting'),
						itemsBinding: binding.sub('itemsBinding')
					}}/>

			<div className='bSchoolMaster'>
				<RouterView routes={binding.sub('eventsRouting')}
							binding={rootBinging}>
					<Route	path='/events/calendar/:schoolId'
							binding={binding}
							component={EventsCalendarComponent}/>

					<Route	path='/events/fixtures/:schoolId'
							binding={binding}
							component={EventsFixturesComponent}/>

					<Route	path="/events/achievement/:schoolId"
							binding={binding}
							component={EventsAchievementComponent}/>
				</RouterView>
			</div>
		</div>;
	}
});

module.exports = EventView;