const	RouterView		= require('module/core/router'),
		Route			= require('module/core/route'),
		LoginRoute		= require('module/core/routes/login_route'),
		LogoutRoute		= require('module/core/routes/logout_route'),
		RegisterRoute	= require('module/core/routes/register_route'),
		SettingsRoute	= require('module/core/routes/settings_route'),
		React			= require('react');

const Center = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	_getRouter: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const role = self.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.role');

		// The only different thing between router for admin/manager and router for other roles
		// is a console route. Admin/manager router has console route. Other role router hasn't console route.
		// Why i do this thing - use two big same router instead one router which has IF statements or functions which
		// return route or not, like in this examples -
		// 		<RouterView>
		//			<Route.../>
		//			<Route.../>
		//			{self._getConsoleRoute()}
		//			<Route.../>
		//		</RouterView>
		//		OR
		//		<RouterView>
		//			<Route.../>
		//			<Route.../>
		//			<IF>
		//				<Route.../>
		//			</IF>
		//			<Route.../>
		//		</RouterView>
		//	IF statement or function return null value if condition is false,
		//	in it's turn RouterView component enumerates all his children and get some data from it.
		//	So, if you use IF statement or function, my friend, you get "Cannot read property '_currentElement' of null" error.
		// )
		if(role === "ADMIN" || role === "MANAGER") {
			return (
				<RouterView routes={ binding.sub('routing') } binding={binding}>
					<RegisterRoute binding={binding.sub('form.register')}/>
					<LoginRoute binding={binding.sub('userData')}/>
					<LogoutRoute binding={binding.sub('userData')}/>

					<SettingsRoute binding={binding.sub('userData')} />

					<Route path="/no_role"
						   component="module/shared_pages/no_role"/>

					<Route path="/student /student/:subPage /student/:subPage/:mode"
						   binding={binding.sub('studentPage')}
						   component="module/as_manager/pages/student/student_page"/>

					<Route path="/profile/:schoolID"
						   binding={binding.sub('schoolProfile')}
						   component="module/as_manager/pages/school_profile/school_profile_page"/>

					<Route path="/school_admin/:subPage /school_admin/:subPage/:mode"
						   binding={binding.sub('activeSchool')}
						   component="module/as_manager/pages/school_admin/school_page"/>

					<Route path="/schools /schools/:subPage"
						   binding={binding.sub('schoolsPage')}
						   component="module/as_manager/pages/schools/schools_page"/>

					<Route path="/events /events/:subPage"
						   binding={binding.sub('events')}
						   component="module/as_manager/pages/events/events"/>

					<Route path="/event /event/:eventId /event/:eventId/:mode"
						   binding={binding.sub('events')}
						   component="module/as_manager/pages/event/event"/>

						<Route path="/school-albums /school-albums/:mode/:albumId /school-albums/:albumId/:mode/:photoId"
							   binding={binding.sub('school-albums')}
							   component="module/as_manager/pages/school_admin/gallery/schoolGalleryRoutes"/>

						<Route path="/event-albums/:eventId/:mode /event-albums/:eventId/:mode/:albumId /event-albums/:eventId/:albumId/:mode/:photoId"
							   binding={binding.sub('event-albums')}
							   component="module/as_manager/pages/event/gallery/eventGalleryRoutes"/>

					<Route path="/invites /invites/:filter /invites/:inviteId/:mode"
						   binding={binding.sub('invites')}
						   component="module/as_manager/pages/invites/invites"/>

					<Route
						path="/school_console /school_console/:filter /school_console/:inviteId/:mode"
						binding={binding.sub('permissions')}
						component="module/as_manager/pages/school_console/school_console"
					/>

					<Route path="/user/view"
						   binding={binding.sub('userDetailPage')}
						   userPermissionsService={window.Server.schoolUserPermissions}
						   isEditable={false}
						   component="module/shared_pages/users/user_view"/>
				</RouterView>
			);
		} else {
			return (
				<RouterView routes={ binding.sub('routing') } binding={binding}>
					<RegisterRoute binding={binding.sub('form.register')}/>
					<LoginRoute binding={binding.sub('userData')}/>
					<LogoutRoute binding={binding.sub('userData')}/>

					<SettingsRoute binding={binding.sub('userData')} />

					<Route path="/no_role"
						   component="module/shared_pages/no_role"/>

					<Route path="/student /student/:subPage /student/:subPage/:mode"
						   binding={binding.sub('studentPage')}
						   component="module/as_manager/pages/student/student_page"/>

					<Route path="/profile/:schoolID"
						   binding={binding.sub('schoolProfile')}
						   component="module/as_manager/pages/school_profile/school_profile_page"/>

					<Route path="/school_admin/:subPage /school_admin/:subPage/:mode"
						   binding={binding.sub('activeSchool')}
						   component="module/as_manager/pages/school_admin/school_page"/>

					<Route path="/schools /schools/:subPage"
						   binding={binding.sub('schoolsPage')}
						   component="module/as_manager/pages/schools/schools_page"/>

					<Route path="/events /events/:subPage"
						   binding={binding.sub('events')}
						   component="module/as_manager/pages/events/events"/>

					<Route path="/event /event/:eventId /event/:eventId/:mode"
						   binding={binding.sub('events')}
						   component="module/as_manager/pages/event/event"/>

					<Route path="/albums /albums/:mode/:albumId /albums/:albumId/:mode/:photoId"
						   binding={binding.sub('albums')}
						   component="module/ui/gallery/albums"/>

					<Route path="/invites /invites/:filter /invites/:inviteId/:mode"
						   binding={binding.sub('invites')}
						   component="module/as_manager/pages/invites/invites"/>

					<Route path="/user/view"
						   binding={binding.sub('userDetailPage')}
						   userPermissionsService={window.Server.schoolUserPermissions}
						   isEditable={false}
						   component="module/shared_pages/users/user_view"/>
				</RouterView>
			);
		}
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
			</div>
		);
	}
});

module.exports = Center;
