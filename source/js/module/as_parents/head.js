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
        var self = this;

        return window.Server.userChildren.get(userId).then(function (data) {
            data.map(function (player) {
                var name = player.firstName + ' ' + player.lastName;
                player.name = name;

                return player;
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
        });

        document.location.hash = 'events/calendar';
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
                            placeholderText={'enter the children name'}
                            onSelect={self.setActiveChild.bind(self)}
                            binding={binding.sub('autocomplete')}
                            />
                    </div>
                </If>
                <UserBlock binding={binding.sub('userData')}/>
            </div>
        )
    }
});

module.exports = Head;
