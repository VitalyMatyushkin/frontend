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
            activeChildId = rootBinding.get('userRules.activeChildId'),
            binding = self.getDefaultBinding(),
            sportsBinding = binding.sub('sports');
        console.info('child id :');
        console.log(activeChildId);
        window.Server.sports.get().then(function (data) {
            sportsBinding
                .atomically()
                .set('sync', true)
                .set('models', Immutable.fromJS(data))
                .commit();
        });
        if(activeChildId) {
            self.request = window.Server.studentEvents.get({id: activeChildId}).then(function (data) {
                binding
                    .atomically()
                    .set('models', Immutable.fromJS(data))
                    .set('sync', true)
                    .commit();
                self.isMounted() && self.forceUpdate();
            });
        }
        else {
            window.Server.userChildren.get({
                id: userId
            }).then(function (userChildren) {
                if(userChildren.length > 0) {
                    self.request = window.Server.studentEvents.get({id: userChildren[0].id}).then(function (data) {
                        binding
                            .atomically()
                            .set('models', Immutable.fromJS(data))
                            .set('sync', true)
                            .commit();
                        self.isMounted() && self.forceUpdate();
                    });
                }
            })
        }
            /* window.Server.userChildren.get({
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
                         allChildrenEventsNoDuplicates = arrayUnique(allChildrenEventsNoDuplicates)[0];
                         binding
                             .atomically()
                             .set('models', Immutable.fromJS(allChildrenEventsNoDuplicates))
                             .set('sync', true)
                             .commit();
                         console.log(allChildrenEventsNoDuplicates);
                         return allChildrenEventsNoDuplicates;
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
             };*/

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
    componentWillUnmount: function() {
        var self = this;

        self.request && self.request.abort();
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

                    </RouterView>
                </div>
            </div>
        </div>;
    }
});


module.exports = EventView;
