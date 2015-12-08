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
            userId = rootBinding.get('userData.authorizationInfo.userId'),
            binding = self.getDefaultBinding(),
            sportsBinding = binding.sub('sports');
        window.Server.sports.get().then(function (data) {
            sportsBinding
                .atomically()
                .set('sync', true)
                .set('models', Immutable.fromJS(data))
                .commit();
            return;
        });

        !binding.get('activeChildId') && window.Server.userChildren.get({
                id: userId
            }).then(function (userChildren) {
                if (userChildren.length > 0) {
                    self.request = window.Server.studentEvents.get({id: userChildren[0].id}).then(function (data) {
                        binding
                            .atomically()
                            .set('activeChildId', Immutable.fromJS(userChildren[0].id))
                            .set('models', Immutable.fromJS(data))
                            .set('sync', true)
                            .commit();
                        return;
                    });
                    return self.request;
                }
                return;
            });

        binding.get('activeChildId') && window.Server.studentEvents.get({id: binding.get('activeChildId')}).then(function (data) {
            binding
                .atomically()
                .set('models', Immutable.fromJS(data))
                .set('sync', true)
                .commit();
            return ;
        });

        self.menuItems = [{
            href: '/#events/calendar',
            name: 'Calendar',
            key: 'Calendar'
        }, {
            href: '/#events/challenges',
            name: 'Fixtures',
            key: 'Fixtures'
        }, {
            href: '/#events/achievement',
            name: 'Achievements',
            key: 'Achievements'
        }];
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinging = self.getMoreartyContext().getBinding();

        return <div>
            <SubMenu binding={binding.sub('eventsRouting')} items={self.menuItems}/>

            <div className='bSchoolMaster'>
                <div className='bEvents'>
                    <RouterView routes={ binding.sub('eventsRouting') } binding={rootBinging}>
                        <Route path='/events/calendar' binding={binding}
                               component='module/as_manager/pages/events/events_calendar'/>
                        <Route path='/events/challenges' binding={binding}
                               component='module/as_manager/pages/events/events_challenges'/>
                        <Route path="/events/achievement" binding={binding}
                               component="module/as_manager/pages/events/events_achievement"/>
                    </RouterView>
                </div>
            </div>
        </div>;
    }
});


module.exports = EventView;
