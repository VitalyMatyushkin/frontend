var Logo = require('module/as_manager/head/logo'),
    TopMenu = require('module/ui/menu/top_menu'),
    UserBlock = require('module/as_manager/head/user_block'),
    Autocomplete = require('module/ui/autocomplete/autocomplete'),
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
            globalBinding = self.getMoreartyContext().getBinding();

        globalBinding
            .atomically()
            .set('userRules.activeChildId', arguments[0])
            .commit();
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
                <div>
                    <Autocomplete
                        serviceFullData={self.serviceChildrenFilter.bind(self, userId)}
                        serverField="name"
                        placeholderText={'enter the children name'}
                        onSelect={self.setActiveChild.bind(self)}
                        binding={binding.sub('autocomplete')}
                        />
                    </div>
                <UserBlock binding={binding.sub('userData')}/>
            </div>
        )
    }
});

module.exports = Head;
