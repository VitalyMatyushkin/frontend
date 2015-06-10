/**
 * Created by bridark on 04/06/15.
 */
var Logo = require('module/as_admin/head/logo'),
    TopMenu = require('module/ui/menu/top_menu'),
    UserBlock = require('module/as_manager/head/user_block'),
    Head;

Head = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        var self = this,
            menuItems;

        self.menuItems = [{
            href: '/#school/fixtures',
            icon: 'icon_home',
            name: 'School',
            key: 'School',
            routes: ['/school/:subPage', '/']
        },{
            href: '/#fixtures',
            icon: 'icon_shot',
            name: 'Fixtures',
            key: 'Fixtures',
            routes: ['/fixtures', '/event']
        },{
            href: '/#calendar?sport=all',
            icon: 'icon_calendar',
            name: 'Calendar',
            key: 'Calendar',
            routes: ['/calendar']
        },{
            href: '/#opponents/map',
            icon: 'icon_teams',
            name: 'Opponents',
            key: 'Opponents',
            routes: ['/opponents', '/opponents/:subPage']
        }/*,{
         href: '/#media',
         icon: 'icon_teams',
         name: 'Media',
         key: 'Media',
         routes: ['/media']
         }*/];
    },
    render: function() {
        var self = this,
            binding = this.getDefaultBinding();

        return (
            <div className="bTopPanel">
                <Logo />
                <TopMenu binding={binding.sub('routing')} />
                <UserBlock binding={binding.sub('userData')} />
            </div>
        )
    }
});

module.exports = Head;
