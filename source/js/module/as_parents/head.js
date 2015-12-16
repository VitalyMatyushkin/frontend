var Logo = require('module/as_manager/head/logo'),
    TopMenu = require('module/ui/menu/top_menu'),
    UserBlock = require('module/as_manager/head/user_block'),
    Autocomplete = require('module/ui/autocomplete/autocomplete'),
    If = require('module/ui/if/if'),
    Head;

Head = React.createClass({
    mixins: [Morearty.Mixin],
    getDefaultState: function() {
        return Immutable.fromJS({
            autocomplete: {}
        });
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
                    binding.set('events.eventChild',Immutable.fromJS(eventChild));
                    player.name = r.firstName+' '+r.lastName;
                    return player;
                });
            });
            return data;
        });
    },
    componentWillMount: function () {
        var self = this;

        self.menuItems = [{
            href: '/#events/calendar',
            icon: 'icon_calendar',
            name: 'Events',
            key: 'Events',
            routes: ['/events/:subPage'],
            authorization: true
        }];
    },
    componentDidMount: function () {
        var self = this;
        React.findDOMNode(self.refs.checkAll).checked = true; //set the check all box to checked
    },
    setActiveChild: function() {
        var self = this,
            binding = self.getDefaultBinding();
        binding
            .atomically()
            .set('events.activeChildId', Immutable.fromJS(arguments[0]))
            .set('sync', true)
            .commit();

        window.Server.studentEvents.get({id: arguments[0]}).then(function (data) {
            binding
                .atomically()
                .set('events.models', Immutable.fromJS(data))
                .set('sync', true)
                .commit();
            React.findDOMNode(self.refs.checkAll).checked = false; //Toggle checkbox off
        });
    },
    toggleCheckAllBox:function(evt){
        var checkBoxAttr = evt.currentTarget.checked,
            self = this,
            binding = self.getDefaultBinding();
        if(checkBoxAttr){
            self.persistChildId = binding.get('events.activeChildId');
            binding
                .atomically()
                .set('events.activeChildId','all')
                .set('events.models',binding.get('events.persistEventModels'))
                .set('sync',true)
                .commit();
        }else{
            if(binding.get('events.activeChildId')==='all' && self.persistChildId === undefined){
                alert('Please choose a student');
                evt.currentTarget.checked = true;
            }else{
                window.Server.studentEvents.get({id: self.persistChildId}).then(function (data) {
                    binding
                        .atomically()
                        .set('events.activeChildId',self.persistChildId)
                        .set('events.models', Immutable.fromJS(data))
                        .set('sync', true)
                        .commit();
                });
            }
        }
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            userId = rootBinding.get('userData.authorizationInfo.userId');

        return (
            <div className="bTopPanel">
                <Logo />
                <TopMenu items={self.menuItems} binding={binding.sub('routing')}/>
                <If condition={rootBinding.get('userData.authorizationInfo.userId')}>
                    <div className="bDropdown">
                        <Autocomplete
                            serviceFullData={self.serviceChildrenFilter.bind(self, userId)}
                            serverField="name"
                            placeholderText={'Enter child name'}
                            onSelect={self.setActiveChild}
                            binding={binding.sub('autocomplete')}
                            />
                    </div>
                </If>
                <If condition={rootBinding.get('userData.authorizationInfo.userId')}>
                    <div className="bDropdown" style={{marginLeft:-68+'px'}}>
                        <input type="checkbox" ref="checkAll" onClick={self.toggleCheckAllBox}>Show for all Children</input>
                    </div>
                </If>
                <UserBlock binding={binding.sub('userData')}/>
            </div>
        )
    }
});

module.exports = Head;
