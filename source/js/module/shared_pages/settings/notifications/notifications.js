/**
 * Created by Woland on 05.09.2017.
 */
const 	React 		= require('react'),
		Morearty 	= require('morearty'),
		Immutable 	= require('immutable'),
		Checkbox 	= require('module/ui/checkbox/checkbox'),
		Button 		= require('module/ui/button/button');

const UserNotificationsSettingPageStyles = require('styles/pages/user/b_user_notifications.scss');

const UserNotificationsSettingPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function(){
		const binding = this.getDefaultBinding();

		window.Server.userNotificationChannels.get().then(channels => {
			const emailChannel = channels.find(channel => channel.type === 'DEFAULT_EMAIL');
			binding.atomically()
				.set('emailChannel', emailChannel)
				.set('isEmailChannel', typeof emailChannel !== 'undefined')
				.commit();
		});
	},
	onChangeCheckbox: function(){
		const 	binding 		= this.getDefaultBinding(),
				isEmailChannel 	= binding.toJS('isEmailChannel');
		
		binding.set('isEmailChannel', !isEmailChannel);
	},
	onClickButtonSave: function(){
		const 	binding 		= this.getDefaultBinding(),
				isEmailChannel 	= binding.toJS('isEmailChannel'),
				emailChannel 	= binding.toJS('emailChannel');
		
		if (!isEmailChannel) {
			window.Server.userNotificationChannel.delete({channelId: emailChannel.id}).then(() => {
				binding.set('isEmailChannel', false);
			});
		} else {
			window.Server.userNotificationChannels.post({type: 'DEFAULT_EMAIL', token: 'email'}).then(emailChannel => {
				binding.atomically()
					.set('emailChannel', emailChannel)
					.set('isEmailChannel', true)
					.commit();
			});
		}
	},
	onClickButtonCancel: function(){
		window.history.back();
	},
	
	render: function(){
		const 	binding 		= this.getDefaultBinding(),
				isEmailChannel 	= binding.toJS('isEmailChannel');
		
		return (
			<div className="bUserNotifications">
				<h3 className="eUserNotificationsTitle">Notifications setting</h3>
				<div className="eUserNotificationsText">
					Email notifications
				</div>
				<Checkbox
					isChecked 	= { isEmailChannel }
					onChange 	= { this.onChangeCheckbox }
					customCss 	= {'mInline'}
				/>
				<div className="eUserNotificationsButtons">
					<Button
						text 				= "Cancel"
						onClick 			= { this.onClickButtonCancel }
						extraStyleClasses 	= "mCancel mMarginRight"
					/>
					<Button
						text 	= "Save"
						onClick = { this.onClickButtonSave }
					/>
				</div>
			</div>
		);
	}
});

module.exports = UserNotificationsSettingPage;