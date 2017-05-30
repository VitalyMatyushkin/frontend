/**
 * Created by Woland on 02.05.2017.
 */
const 	React 			= require('react'),
		Morearty		= require('morearty'),
		Model 			= require('module/as_admin/pages/admin_user/admin_user_notification_channel/admin_user_notification_channel_class'),
		Grid 			= require('module/ui/grid/grid'),
		ConfirmPopup	= require('module/ui/confirm_popup'),
		Button			= require('module/ui/button/button'),
		If 				= require('module/ui/if/if'),
		SVG				= require('module/ui/svg'),
		FormField 		= require('module/ui/form/form_field'),
		Form 			= require('module/ui/form/form'),
		propz 			= require('propz');

const AdminUserNotificationChannelStyles = require('styles/pages/notifications/b_notification_channel.scss');

const CHANNEL_TYPE = [{
	value: 	'IOS',
	type: 	'IOS',
	id: 	'IOS'
}, {
	value: 	'ANDROID',
	type: 	'ANDROID',
	id: 	'ANDROID'
}];

const AdminUserNotificationChannel = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		userId: React.PropTypes.string.isRequired
	},

	componentWillMount: function () {
		this.model = new Model(this);
	},

	onCloseClick: function(){
		const binding = this.getDefaultBinding();
		binding.set('isPopupOpen', false);
	},

	onSubmit: function(data){
		const	userId 	= this.props.userId,
				binding = this.getDefaultBinding();

		window.Server.notificationChannel.post(
			{
				userId: userId
			},
			{
				token: 			data.token,
				deviceName: 	data.deviceName,
				environment: 	data.environment,
				appId: 			data.appId,
				type: 			data.type
			}
		).then(
			() => {
				binding.set('isPopupOpen', false);
				window.simpleAlert(
					'Notification channel has been successfully added',
					'Ok'
				);

			},
			(error) => {
				binding.set('isPopupOpen', false);
				const errorText = propz.get(error, ["xhr", "responseJSON", "details", "text"]);
				window.simpleAlert(
					`Rejected from server with response: ${errorText}`,
					'Ok'
				);
			}
		);
	},

	render: function () {
		const binding = this.getDefaultBinding();

		if (typeof this.model.grid !== 'undefined') {
			return (
				<div className="bNotificationChannel">
					<Grid model={this.model.grid}/>
					<If condition={Boolean(binding.toJS('isPopupOpen'))}>
						<ConfirmPopup
							customStyle		= { 'ePopup' }
							isShowButtons	= { false }
						>
							<div className="eClose" onClick={this.onCloseClick}>
								<SVG icon="icon_delete"/>
							</div>
							<div className="eHeader">Add notification channel</div>
							<Form
								binding				= { binding }
								onSubmit			= { this.onSubmit }
								defaultButton 		= { "Add channel" }
								hideCancelButton 	= { true }
							>
								<FormField
									type		= "text"
									field		= "token"
									validation	= "required"
								>
									Token
								</FormField>
								<FormField
									type	= "text"
									field	= "deviceName"
								>
									Device name
								</FormField>
								<FormField
									type	= "text"
									field	= "environment"
								>
									Environment
								</FormField>
								<FormField
									type	= "text"
									field	= "appId"
								>
									App ID
								</FormField>
								<FormField
									type		= "select"
									field		= "type"
									sourceArray = { CHANNEL_TYPE }
								>
									Type
								</FormField>
							</Form>
						</ConfirmPopup>
					</If>
				</div>
			);
		} else {
		    return null;
		}

	}
});

module.exports = AdminUserNotificationChannel;