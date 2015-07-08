var RouterView = require('module/core/router'),
	Route = require('module/core/route'),
	LoginRoute = require('module/core/routes/login_route'),
	LogoutRoute = require('module/core/routes/logout_route'),
	RegisterRoute = require('module/core/routes/register_route'),
	VerifyRoute = require('module/core/routes/verify_route'),
	SettingsRoute = require('module/core/routes/settings_route'),
	Center;

Center = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			currentPage =  binding.get('routing.currentPageName') || '',
			mainClass = 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
		//<VerifyRoute binding={binding.sub('userData')} />

		return (
			<div className={mainClass}>
				<div className="bPageWrap">

					<RouterView routes={ binding.sub('routing') } binding={binding}>

						<RegisterRoute binding={binding.sub('form.register')}  />
						<LoginRoute binding={binding.sub('userData')}  />
						<LogoutRoute binding={binding.sub('userData')}  />
                        <VerifyRoute binding={binding.sub('userData')} />
						<SettingsRoute binding={binding.sub('userData')} />

						<Route path="/student" binding={binding.sub('studentPage')} component="module/as_manager/pages/student/student_page" />

						<Route path="/profile/:schoolID" binding={binding.sub('schoolProfile')} component="module/as_manager/pages/school_profile/school_profile_page"  />

						<Route path="/school_admin/:subPage /school_admin/:subPage/:mode" binding={binding.sub('activeSchool')} component="module/as_manager/pages/school_admin/school_page"  />

						<Route path="/schools /schools/:subPage" binding={binding.sub('schoolsPage')} component="module/as_manager/pages/schools/schools_page"  />


                        <Route path="/events /events/:subPage" binding={binding.sub('events')} component="module/as_manager/pages/events/events"  />
                        <Route path="/event /event/:eventId /event/:eventId/:mode" binding={binding.sub('events')} component="module/as_manager/pages/event/event"  />
						<Route path="/albums /albums/:albumId" binding={binding.sub('albums')} component="module/as_manager/pages/albums/albums"  />

						<Route path="/invites /invites/:filter /invites/:inviteId/:mode" binding={binding.sub('invites')} component="module/as_manager/pages/invites/invites"  />
						<Route path="/school_console /school_console/:filter /school_console/:inviteId/:mode" binding={binding.sub('permissions')} component="module/as_manager/pages/school_console/school_console"  />
                    </RouterView>

				</div>
			</div>
		)
	}
});

/*
 <Route path="/leaner" binding={binding.sub('leaner')} component="module/as_manager/pages/leaner/page" />

 <Route path="/schools" binding={binding.sub('schoolsList')} component="module/as_manager/pages/schools/page"  />


 <Route path="/schools/view" binding={binding.sub('school')} component="module/as_manager/pages/school_admin/page"  />

 */
//<Route path="/register" component="module/as_manager/pages/register/school" pageName="register"  />
//<Route binding={binding.sub('schoolsList')} path="/schools/add" component="module/as_manager/pages/schools/add" pageName="schoolsAdd"  />
//<Route path="/me" component="module/as_manager/pages/me/me" pageName="me"  />

module.exports = Center;
