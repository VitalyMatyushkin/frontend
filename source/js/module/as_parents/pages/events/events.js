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
        self.eventModel = [];
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
            //Set the requirement for an all children view here
                if (userChildren && userChildren.length > 0) {
                    self.request = userChildren.map(function(child){
                        window.Server.studentEvents.get({id:child.id})
                            .then(function(data){self.processRequestData(data,child.userId)});
                    });
                    return self.request;
                }
            });

        binding.get('activeChildId') && window.Server.studentEvents.get({id: binding.get('activeChildId')}).then(function (data) {
            binding
                .atomically()
                .set('models', Immutable.fromJS(data))
                .set('sync', true)
                .commit();
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
    processRequestData:function(reqData,id){
        var self = this,
            binding = self.getDefaultBinding();
        if(reqData){
            reqData.forEach(function(el){
                if(el !== undefined){
                    el.childId = id;
                    self.eventModel.push(el);
                }
            });
            binding
                .atomically()
                .set('activeChildId','all')
                .set('persistEventModels',Immutable.fromJS(self.eventModel))
                .set('models',Immutable.fromJS(self.eventModel))
                .set('sync',true)
                .commit();
        }
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
