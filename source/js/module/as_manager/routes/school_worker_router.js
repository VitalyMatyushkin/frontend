const	React							= require('react'),
		Morearty						= require('morearty'),

		MoreartyHelper					= require('module/helpers/morearty_helper'),

		RouterView						= require('module/core/router'),
		Route							= require('module/core/route'),
		LoginRoute						= require('module/core/routes/login_route2'),
		LogoutRoute						= require('module/core/routes/logout_route'),
		SettingsRoute					= require('module/core/routes/settings_route'),

		AdminSchoolPageComponent		= require('module/as_manager/pages/school_admin/school_page'),
		SchoolPageComponent				= require('module/as_manager/pages/schools/schools_page'),
		EventsComponent					= require('module/as_manager/pages/events/events'),
		ClubComponent					= require('module/as_manager/pages/clubs/clubs_page'),
		EventComponent					= require('../pages/event/event_page'),
		SchoolGalleryRoutesComponent	= require('module/as_manager/pages/school_admin/gallery/schoolGalleryRoutes'),
		InvitesComponent				= require('module/as_manager/pages/invites/invites'),
		SchoolConsoleComponent			= require('module/as_manager/pages/school_console/school_console'),
		UserViewComponent				= require('module/shared_pages/users/user_view'),
		DemoViewComponent				= require('module/shared_pages/demo_slider/demo_slider'),
		MessagesComponent				= require('module/as_manager/pages/messages/messages');

/**
 * It's a router for all school workers:
 * ADMIN, MANAGER, OWNER, TEACHER, COACH.
 */
const SchoolWorkerRouter = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);
	},
	render: function() {
		const binding = this.getDefaultBinding();
		
		return (
			<RouterView	routes	= {binding.sub('routing')}
						binding	= {binding}
			>
				<LoginRoute		binding	= {binding.sub('userData')} />
				<LogoutRoute	binding	= {binding.sub('userData')} />
				<SettingsRoute	binding	= {binding.sub('userData')} />

				<Route	path		= "/school_admin/:subPage /school_admin/:subPage/:mode"
						binding		= {binding.sub('activeSchool')}
						component	= {AdminSchoolPageComponent}
				/>

				<Route	path		= "/schools /schools/:subPage"
						binding		= {binding.sub('schoolsPage')}
						component	= {SchoolPageComponent}
				/>

				<Route	path		= "/events /events/:subPage"
						binding		= {binding.sub('events')}
						component	= {EventsComponent}
				/>

				<Route	path		= "/event /event/:eventId /event/:eventId/:mode"
						binding		= {binding.sub('events')}
						component	= {EventComponent}
				/>

				<Route	path			= "/clubs /clubs/:subPage /clubs/:mode"
						binding			= { binding.sub('clubsPage') }
						activeSchoolId	= { this.activeSchoolId }
						component		= { ClubComponent }
				/>

				<Route	path		= "/school-albums /school-albums/:mode/:albumId /school-albums/:albumId/:mode/:photoId"
						binding		= {binding.sub('school-albums')}
						component	= {SchoolGalleryRoutesComponent}
				/>

				<Route	path		= "/invites /invites/:filter /invites/:inviteId/:mode"
						binding		= {binding.sub('invites')}
						component	= {InvitesComponent}
				/>

				<Route	path		= '/messages /messages/:subPage'
						binding		= {binding.sub('messages')}
						component	= {MessagesComponent}
				/>

				<Route	path		= "/school_console /school_console/:filter /school_console/:inviteId/:mode"
						binding		= {binding.sub('permissions')}
						component	= {SchoolConsoleComponent}
				/>

				<Route	path					= "/user/view"
						binding					= {binding.sub('userDetailPage')}
						userPermissionsService	= {window.Server.schoolUserPermissions}
						isEditable				= {false}
						component				= {UserViewComponent}
				/>
				
				<Route	path					= "/demo"
						binding					= {binding.sub('demo')}
						component				= {DemoViewComponent}
				/>
			</RouterView>
		);
	}
});

module.exports = SchoolWorkerRouter;
