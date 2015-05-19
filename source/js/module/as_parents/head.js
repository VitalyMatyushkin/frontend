var Logo = require('module/as_parents/head/logo'),
    TopMenu = require('module/ui/menu/top_menu'),
    UserBlock = require('module/as_manager/head/user_block'),
    Autocomplete = require('module/ui/autocomplete/autocomplete'),
    Head;

Head = React.createClass({
    mixins: [Morearty.Mixin],
    serviceSchoolFilter: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            userId = rootBinding.get('userData.authorizationInfo.userId');

        return window.Server.userChildren.get({id: userId});
    },
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            menuItems;

        self.userId = rootBinding.get('userData.authorizationInfo.userId');

        self.menuItems = [{
            href: '/#events/calendar',
            icon: 'icon_calendar',
            name: 'Events',
            key: 'Events',
            routes: ['/events/:subPage'],
            authorization: true
        }];
    },
    render: function () {
        var self = this,
            binding = this.getDefaultBinding();

        return (
            <div className="bTopPanel">
                <Logo />
                <TopMenu items={self.menuItems} binding={binding.sub('routing')}/>
                <div>
                    <Autocomplete
                        serviceFullData = {function(){return window.Server.userChildren.get({id: self.userId});}}
                        serverField="firstName"
                        placeholderText={'enter the first house name'}
                        onSelect={console.log('on select')}
                        //binding={binding.sub('autocomplete')}
                        />
                    </div>
                <UserBlock binding={binding.sub('userData')}/>
            </div>
        )
    }
});

module.exports = Head;
