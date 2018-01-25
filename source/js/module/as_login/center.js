/**
 * Created by wert on 16.01.16.
 */
const   React               = require('react'),
        RouterView          = require('module/core/router'),
        LoginRoute2         = require('../core/routes/login_route2'),
        LogoutRoute         = require('module/core/routes/logout_route'),
        RegisterRoute       = require('module/core/routes/register_route'),
        SettingsRoute       = require('module/core/routes/settings_route'),
        Morearty            = require('morearty'),
        NotificationAlert	= require('./../ui/notification_alert/notification_alert'),
        ConfirmAlert		= require('./../ui/confirm_alert/confirm_alert'),
        MainLayoutStyle		= require('styles/main/b_main_layout.scss'),
		BasicStyle			= require('styles/style.scss');

const Center = React.createClass({
    mixins: [Morearty.Mixin],
    render: function(){
        const   binding         = this.getDefaultBinding(),
                currentPage     = binding.get('routing.currentPageName') || '',
                mainClass       = 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);	// TODO: ???

        return (
            <div className={mainClass}>
                <div className="bPageWrap">
                    <RouterView routes={ binding.sub('routing') } binding={binding}>
                        <RegisterRoute  binding={binding.sub('form.register')} />
                        <LoginRoute2    binding={binding.sub('userData')} />
                        <LogoutRoute    binding={binding.sub('userData')} />
                        <SettingsRoute  binding={binding.sub('userData')} />
                    </RouterView>
				</div>
                <NotificationAlert binding={binding.sub('notificationAlertData')} />
                <ConfirmAlert binding={binding.sub('confirmAlertData')} />
			</div>
        );
    }
});

module.exports = Center;