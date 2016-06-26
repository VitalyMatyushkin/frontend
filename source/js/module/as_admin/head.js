/**
 * Created by bridark on 04/06/15.
 */
const   Logo        = require('module/as_admin/head/logo'),
        TopMenu     = require('module/ui/menu/top_menu'),
        UserBlock   = require('module/shared_pages/head/user_block'),
        React       = require('react');
    

const Head = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        var self = this;

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
                <UserBlock binding={binding.sub('userData')} asAdmin={true} />
            </div>
        )
    }
});

module.exports = Head;
