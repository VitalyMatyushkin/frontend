var Logo = require('module/as_parents/head/logo'),
    TopMenu = require('module/ui/menu/top_menu'),
    UserBlock = require('module/as_manager/head/user_block'),
    Head;

Head = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            menuItems;

        self.menuItems = [{
            href: '/#school/summary',
            icon: 'icon_home',
            name: 'School',
            key: 'School',
            routes: ['/school', '/'],
            authorization: true
        }, {
            href: '/#teams/summary',
            icon: 'icon_teams',
            name: 'Teams',
            key: 'Teams',
            routes: ['/teams'],
            authorization: true
        }, {
            href: '/#fixtures',
            icon: 'icon_shot',
            name: 'Fixtures',
            key: 'Fixtures',
            routes: ['/fixtures'],
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
                <UserBlock binding={binding.sub('userData')}/>
            </div>
        )
    }
});

module.exports = Head;
