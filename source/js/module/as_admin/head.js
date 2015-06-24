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
            href: '/#admin_schools',
            icon: 'icon_home',
            name: 'Dashboard',
            key: 'Dashboard',
            routes:['/admin_schools/:subPage', '/school_console/:filter', '/school_console/:inviteId/:mode'],
            authorization:true
        }];
    },
    render: function() {
        var self = this,
            binding = this.getDefaultBinding();

        return (
            <div className="bTopPanel">
                <Logo />
                <TopMenu items={self.menuItems} binding={binding.sub('routing')} />
                <UserBlock binding={binding.sub('userData')} />
            </div>
        )
    }
});

module.exports = Head;
