const	RouterView						= require('module/core/router'),
		Route							= require('module/core/route'),
		LoginRoute						= require('module/core/routes/login_route'),
		LogoutRoute						= require('module/core/routes/logout_route'),
		RegisterRoute					= require('module/core/routes/register_route'),
		SettingsRoute					= require('module/core/routes/settings_route'),
		Morearty						= require('morearty'),
		React							= require('react'),
		AdminSchoolPageComponent		= require('module/as_manager/pages/school_admin/school_page'),
		SchoolPageComponent				= require('module/as_manager/pages/schools/schools_page'),
		EventsComponent					= require('module/as_manager/pages/events/events'),
		EventComponent					= require('./pages/event/event_page'),
		SchoolGalleryRoutesComponent	= require('module/as_manager/pages/school_admin/gallery/schoolGalleryRoutes'),
		EventGalleryRoutesComponent		= require('module/as_manager/pages/event/gallery/eventGalleryRoutes'),
		InvitesComponent				= require('module/as_manager/pages/invites/invites'),
		SchoolConsoleComponent			= require('module/as_manager/pages/school_console/school_console'),
		UserViewComponent				= require('module/shared_pages/users/user_view'),
		NotificationAlert				= require('./../ui/notification_alert/notification_alert'),
		ConfirmAlert					= require('./../ui/confirm_alert/confirm_alert');

const Center = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	_getRouter: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<RouterView routes={ binding.sub('routing') } binding={binding}>
				<RegisterRoute binding={binding.sub('form.register')}/>
				<LoginRoute binding={binding.sub('userData')}/>
				<LogoutRoute binding={binding.sub('userData')}/>

				<SettingsRoute binding={binding.sub('userData')} />

				<Route path="/school_admin/:subPage /school_admin/:subPage/:mode"
					   binding={binding.sub('activeSchool')}
					   component={AdminSchoolPageComponent}/>

				<Route path="/schools /schools/:subPage"
					   binding={binding.sub('schoolsPage')}
					   component={SchoolPageComponent}/>

				<Route path="/events /events/:subPage"
					   binding={binding.sub('events')}
					   component={EventsComponent}/>

				<Route path="/event /event/:eventId /event/:eventId/:mode"
					   binding={binding.sub('events')}
					   component={EventComponent}/>

				<Route path="/school-albums /school-albums/:mode/:albumId /school-albums/:albumId/:mode/:photoId"
					   binding={binding.sub('school-albums')}
					   component={SchoolGalleryRoutesComponent}/>

				<Route path="/event-albums/:eventId/:mode /event-albums/:eventId/:mode/:albumId /event-albums/:eventId/:albumId/:mode/:photoId"
					   binding={binding.sub('event-albums')}
					   component={EventGalleryRoutesComponent}/>

				<Route path="/invites /invites/:filter /invites/:inviteId/:mode"
					   binding={binding.sub('invites')}
					   component={InvitesComponent}/>

				<Route
					path="/school_console /school_console/:filter /school_console/:inviteId/:mode"
					binding={binding.sub('permissions')}
					component={SchoolConsoleComponent}/>

				<Route path="/user/view"
					   binding={binding.sub('userDetailPage')}
					   userPermissionsService={window.Server.schoolUserPermissions}
					   isEditable={false}
					   component={UserViewComponent}/>
			</RouterView>
		);
	},
	render: function() {
		const	self		= this,
				binding		= self.getDefaultBinding();

		const	currentPage	= binding.get('routing.currentPageName') || '',
				mainClass	= `bMainLayout mClearFix m${currentPage.charAt(0).toUpperCase()}${currentPage.slice(1)}`;

		return (
			<div className={mainClass}>
				<div className="bPageWrap">
					{self._getRouter()}
				</div>
				<NotificationAlert binding={binding.sub('notificationAlertData')} />
				<ConfirmAlert binding={binding.sub('confirmAlertData')} />
			</div>
		);
	}
});

module.exports = Center;
