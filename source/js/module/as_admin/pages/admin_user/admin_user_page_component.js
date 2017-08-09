/**
 * Created by Woland on 02.05.2017.
 */
const	RouterView						= require('module/core/router'),
		Route							= require('module/core/route'),
		React							= require('react'),
		SubMenu							= require('module/ui/menu/sub_menu'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),
		AdminUserNotificationChannel 	= require('module/as_admin/pages/admin_user/admin_user_notification_channel/admin_user_notification_channel'),
		AdminUserNotifications 			= require('module/as_admin/pages/admin_user/admin_user_notifications/admin_user_notifications'),
		UserViewComponent 				= require('module/shared_pages/users/user_view');

const AdminUserPageComponent = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount:function(){
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				userId 			= globalBinding.get('routing.parameters.id'),
				menuItems 		= [
					{
						href: 	'/#users',
						name: 	'← user list',
						key: 	'back'
					},
					{
						href: 		`/#user/view?id=${userId}`,
						name: 		'Summary',
						key: 		'Summary',
						routes: 	[`/#user/view?id=${userId}`]
					},
					{
						href: 		`/#user/notifications-view?id=${userId}`,
						name: 		'Notifications',
						key: 		'Notifications',
						routes: 	[`/#user/notifications-view?id=${userId}`]
					},
					{
						href: 		`/#user/notification-channel-view?id=${userId}`,
						name: 		'Notification Channel',
						key: 		'Notification Channel',
						routes: 	[`/#user/notification-channel-view?id=${userId}`]
					}
				];
		//Set sub menu items in default binding
		binding.set('subMenuItems',Immutable.fromJS(menuItems));
	},
	render: function(){
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				userId 			= globalBinding.get('routing.parameters.id');
		
		return (
			<div>
				<SubMenu binding={{default: binding.sub('schoolRouting'), itemsBinding: binding.sub('subMenuItems')}} />
				<div className="bSchoolMaster">
					<RouterView routes={binding.sub('schoolRouting')} binding={globalBinding}>
						<Route
							path 		= "user/view"
							binding 	= { binding.sub('schools') }
							component 	= { UserViewComponent }
						/>
						<Route
							path 		= "user/notifications-view"
							binding 	= { binding.sub('userNotifications') }
							component 	= { AdminUserNotifications }
							userId 		= { userId }
						/>
						<Route
							path 		= "user/notification-channel-view"
							binding 	= { binding.sub('userNotificationChannel') }
							component 	= { AdminUserNotificationChannel }
							userId 		= { userId }
						/>
					</RouterView>
				</div>
			</div>
		);
	}
});

module.exports = AdminUserPageComponent;