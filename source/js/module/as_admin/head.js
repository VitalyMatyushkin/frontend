// @flow
/**
 * Created by bridark on 04/06/15.
 */
const   Logo        = require('module/as_admin/head/logo'),
        TopMenu     = require('module/ui/menu/top_menu'),
        UserBlock   = require('module/shared_pages/head/user_block'),
        Morearty    = require('morearty'),
        React       = require('react'),
        TopNavStyle = require('styles/main/b_top_nav.scss'),
        Bootstrap  	= require('styles/bootstrap-custom.scss');
    

const Head = React.createClass({
    mixins: [Morearty.Mixin],
    render: function() {
        const binding = this.getDefaultBinding();

        // TODO: should it be here ??
		const menuItems = [{
			href: '/#admin_schools',
			icon: 'icon_home',
			name: 'Dashboard',
			key: 'Dashboard',
			routes:['/admin_schools/:subPage', '/school_console/:filter', '/school_console/:inviteId/:mode'],
			authorization:true
		}];

        return (
            <div className="bTopPanel container">
                <div className="row">
                    <div className="col-md-4">
                        <Logo />
                    </div>
                    <div className="col-md-8 bTopNav">
                        <TopMenu items={this.menuItems} binding={binding.sub('routing')}/>
                        <UserBlock binding={binding.sub('userData')} asAdmin={true}/>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Head;
