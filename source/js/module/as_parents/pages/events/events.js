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
        });

        window.Server.userChildren.get({
            id: userId
        }).then(function (userChildren) {
            console.log(userChildren);
            var allChildrenReturn = [];
            var allChildrenResults = function (userChildren, allChildrenEvents) {
                console.log(userChildren);
                console.log(allChildrenEvents);
                if (userChildren.length < 1) {
                    var allChildrenEventsNoDuplicates = allChildrenEvents.map(function(events){
                        var eventList = [];
                        for(var i = 0; i < events.length; i++) eventList.push(events[i]);
                        return eventList;
                    });
                    allChildrenEvents = arrayUnique(allChildrenEventsNoDuplicates)[0];
                    binding
                        .atomically()
                        .set('models', Immutable.fromJS(allChildrenEvents))
                        .set('sync', true)
                        .commit();
                    console.log(allChildrenEvents);
                    return allChildrenEvents;
                }
                window.Server.studentEvents.get({
                    id: userChildren[0].id
                }).then(function (childResults) {
                    allChildrenEvents.push(childResults);
                    userChildren.shift();
                    console.log(userChildren);
                    console.log(allChildrenEvents);
                    return allChildrenResults(userChildren, allChildrenEvents);
                })
            };
            allChildrenResults(userChildren, allChildrenReturn);

        });

        function arrayUnique(array) {
            var a = array.concat();
            for(var i=0; i<a.length; ++i) {
                for(var j=i+1; j<a.length; ++j) {
                    if(a[i].id === a[j].id)
                        a.splice(j--, 1);
                }
            }

            return a;
        };

        self.menuItems = [{
            href: '/#events/calendar',
            name: 'Calendar',
            key: 'Calendar'
        }, {
            href: '/#events/challenges',
            name: 'Fixtures',
            key: 'Fixtures'
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
                               component='module/as_parents/pages/events/events_calendar'/>
                        <Route
                            path='/events/manager'
                            binding={{default: binding.sub('newEvent'), sports: binding.sub('sports'), calendar: binding.sub('calendar')}}
                            component='module/as_parents/pages/events/event_manager'/>
                        <Route path='/events/challenges' binding={binding}
                               component='module/as_parents/pages/events/events_challenges'/>
                        <Route path='/events/invites' binding={binding}
                               component='module/as_parents/pages/events/events_invites'/>
                    </RouterView>
                </div>
            </div>
        </div>;
    }
});


module.exports = EventView;
