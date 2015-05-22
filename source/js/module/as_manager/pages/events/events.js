var EventView,
    RouterView = require('module/core/router'),
    Route = require('module/core/route'),
    SubMenu = require('module/ui/menu/sub_menu');

EventView = React.createClass({
	mixins: [Morearty.Mixin],
    getMergeStrategy: function () {
        return Morearty.MergeStrategy.MERGE_REPLACE
    },
    getDefaultState: function () {
        var self = this;

        return Immutable.fromJS({
            eventsRouting: {},
            teams: [],
            sports: {
                models: [],
                sync: false
            },
            models: [],
            sync: false,
            newEvent: {}
        });
    },
    componentWillMount: function () {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
            binding = self.getDefaultBinding(),
            sportsBinding = binding.sub('sports');

        window.Server.sports.get().then(function (data) {
            sportsBinding
                .atomically()
                .set('sync', true)
                .set('models', Immutable.fromJS(data))
                .commit();
        });

        window.Server.eventsBySchoolId.get({
            schoolId: activeSchoolId
        }).then(function (data) {
            binding
                .atomically()
                .set('models', Immutable.fromJS(data))
                .set('sync', true)
                .commit();
        });

        self.menuItems = [
        {
            key: 'goback',
            name: '? Cancel',
            hash: '#'
        },
        {
            href: '/#events/calendar',
            name: 'Calendar',
            key: 'Calendar'
        },{
            href: '/#events/challenges',
            name: 'Fixtures',
            key: 'Fixtures'
        },
        {
            href: '/#events/manager',
            name: 'New',
            key: 'New...'
        }];
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinging = self.getMoreartyContext().getBinding();

		return <div>
            <SubMenu binding={binding.sub('eventsRouting')} items={self.menuItems} />
			<div className='bSchoolMaster'>
				<div className='bEvents'>
					<RouterView routes={ binding.sub('eventsRouting') } binding={rootBinging}>
						<Route path='/events/calendar'  binding={binding}component='module/as_manager/pages/events/events_calendar'   />
						<Route
							path='/events/manager'
							binding={{default: binding.sub('newEvent'), sports: binding.sub('sports'), calendar: binding.sub('calendar')}}
							component='module/as_manager/pages/events/event_manager'  />
						<Route path='/events/challenges' binding={binding} component='module/as_manager/pages/events/events_challenges'  />
						<Route path='/events/invites' binding={binding} component='module/as_manager/pages/events/events_invites'  />
					</RouterView>
				</div>
			</div>
        </div>;
	}
});


module.exports = EventView;
