/**
 * Created by Anatoly on 29.05.2016.
 */
const	React							= require('react'),
		Morearty						= require('morearty'),
		RouterView						= require('module/core/router'),
		Route							= require('module/core/route'),
		PasswordResetComponent 			= require('module/as_password/forgot_password/reset'),
		PasswordResetRequestComponent	= require('module/as_password/forgot_password/reset_request'),

		NotificationAlert				= require('../ui/notification_alert/notification_alert'),
		ConfirmAlert					= require('../ui/confirm_alert/confirm_alert');

const Center = React.createClass({
    mixins: [Morearty.Mixin],
    render: function(){
        const   binding         = this.getDefaultBinding(),
                currentPage     = binding.get('routing.currentPageName') || '',
                mainClass       = 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

        return (
			<div className={mainClass}>
				<div className="bPageWrap">
					<RouterView routes={ binding.sub('routing') } binding={binding}>

						<Route path="/reset"
							   binding={binding.sub('reset')}
							   component={PasswordResetComponent}
							   unauthorizedAccess={true}/>

						<Route path="/reset-request"
							   binding={binding.sub('reset-request')}
							   component={PasswordResetRequestComponent}
							   unauthorizedAccess={true}/>

					</RouterView>
				</div>
				<NotificationAlert binding={binding.sub('notificationAlertData')} />
				<ConfirmAlert binding={binding.sub('confirmAlertData')} />
			</div>
        );
    }

});

module.exports = Center;