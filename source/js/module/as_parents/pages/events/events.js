const   RouterView  = require('module/core/router'),
        Route       = require('module/core/route'),
        React       = require('react'),
        SubMenu     = require('module/ui/menu/sub_menu'),
        Immutable   = require('immutable');

const EventView = React.createClass({
    mixins: [Morearty.Mixin],
    getMergeStrategy: function () {
        return Morearty.MergeStrategy.MERGE_REPLACE
    },
    getDefaultState: function () {
        var self = this;

        return Immutable.fromJS({
            eventsRouting: {},
            eventChild:[],
            teams: [],
            sports: {
                models: [],
                sync: false
            },
            eventsOfAllChildren:[],
            models: [],
            sync: false,
            newEvent: {}
        });
    },
    componentWillMount: function () {
        const self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            userId = rootBinding.get('userData.authorizationInfo.userId'),
            binding = self.getDefaultBinding(),
            sportsBinding = binding.sub('sports');

        self.serviceChildrenFilter(userId);
        self.setActiveChild();
        self.eventModel = [];
        window.Server.sports.get().then(function (data) {
            sportsBinding
                .atomically()
                .set('sync', true)
                .set('models', Immutable.fromJS(data))
                .commit();
            return data;
        });

        self.loadEvents(userId);
    },
    componentDidMount:function(){
        const self = this,
            binding = self.getDefaultBinding();

        self.addBindingListener(binding, 'eventChild', self.createSubMenu);
        self.addBindingListener(binding, 'eventsRouting.currentPathParts', self.createSubMenu);
        self.addBindingListener(binding, 'eventsRouting.pathParameters', self.setActiveChild);
        self.addBindingListener(binding, 'activeChildId', self.filterEvents);
    },
    setActiveChild: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            params = binding.toJS('eventsRouting.pathParameters'),
            newValue = params && params.length > 0 ? params[0]:'all';

        binding.set('activeChildId', newValue);
    },
    createSubMenu: function(){
        const self = this,
            binding = self.getDefaultBinding(),
            children = binding.toJS('eventChild'),
            partPath = binding.toJS('eventsRouting.currentPathParts'),
            mainMenuItem = partPath && partPath.length > 1 ? '/#' + partPath[0] + '/' + partPath[1] : '',
            menuItems = [];

        children.forEach(child => {
            menuItems.push({
                icon: child.gender === 'female' ? 'icon_girl':'icon_boy',
                href: mainMenuItem + '/' + child.id,
                name: child.firstName + ' ' + child.lastName,
                key: child.id
            });
        });
        menuItems.push({
            icon: 'icon_girl_boy',
            href: mainMenuItem + '/all',
            name: 'Show all children',
            key: 'all'
        });
        binding.set('itemsBinding', Immutable.fromJS(menuItems));
    },
    loadEvents:function(userId){
        const self = this;

        window.Server.userChildren.get({
            id: userId
        }).then(function (userChildren) {
            //Set the requirement for an all children view here
            if (userChildren && userChildren.length > 0) {
                self.request = userChildren.map(function(child){
                    window.Server.studentEvents.get({id:child.id})
                        .then(function(data){
                            self.processRequestData(data,child.userId);
                        });
                });
                return self.request;
            }
        });

    },
    filterEvents:function(){
        const self = this,
            binding = self.getDefaultBinding(),
            allEvents = binding.toJS('eventsOfAllChildren'),
            childId = binding.get('activeChildId');

        if(childId && allEvents && allEvents.length > 0){
            let res = childId === 'all' ? allEvents : allEvents.filter(ev => ev.childId === childId);
            binding.set('models', Immutable.fromJS(res));
        }
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
                .set('eventsOfAllChildren',Immutable.fromJS(self.eventModel))
                .set('models',Immutable.fromJS(self.eventModel))
                .set('sync',true)
                .commit();
        }
    },
    serviceChildrenFilter: function (userId) {
        var self = this,
            eventChild = [],
            binding = self.getDefaultBinding();
        return window.Server.userChildren.get(userId).then(function (data) {
            //Initial API call only returns ids of the user's children
            data.map(function (player) {
                //Iterates and fetches all other details by making extra API calls
                window.Server.user.get({id:player.userId}).then(function(r){
                    eventChild.push(r);
                    binding.set('eventChild',Immutable.fromJS(eventChild));
                    player.name = r.firstName+' '+r.lastName;
                    return player;
                });
            });
            return data;
        });
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinging = self.getMoreartyContext().getBinding();

        return <div className="bParentsPage">
            <SubMenu binding={{default: binding.sub('eventsRouting'), itemsBinding: binding.sub('itemsBinding')}} items={self.menuItems}/>

            <div className='bSchoolMaster'>
                <div className="eSchoolMaster_wrap">
                    <h1 className="eSchoolMaster_title"></h1>
                    <div className="eStrip"></div>
                </div>
                <div className='bEvents'>
                    <RouterView routes={ binding.sub('eventsRouting') } binding={rootBinging}>
                        <Route path='/events/calendar /events/calendar/:userId' binding={binding}
                               component='module/as_parents/pages/events/events_calendar'/>
                        <Route path='/events/challenges /events/challenges/:userId' binding={binding}
                               component='module/as_manager/pages/events/events_challenges'/>
                        <Route path="/events/achievement /events/achievement/:userId" binding={binding}
                               component="module/as_manager/pages/events/events_achievement"/>
                    </RouterView>
                </div>
            </div>
        </div>;
    }
});


module.exports = EventView;
