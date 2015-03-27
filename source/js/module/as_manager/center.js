var RouterView = require('module/core/router'),
	Route = require('module/core/route'),
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

		return (
			<div className={mainClass}>
				<div className="bPageWrap">

					<RouterView routes={ binding.sub('routing') } binding={binding}>

						<Route path="/register"  binding={binding.sub('form.register')} component="module/as_manager/pages/register/user" unauthorizedAccess={true}  />
						<Route path="/login" binding={binding.sub('userData')} component="module/as_manager/pages/login/user" loginRoute={true}  />
						<Route path="/logout" binding={binding.sub('userData')} component="module/as_manager/pages/logout/logout" unauthorizedAccess={true}  />
						<Route path="/settings /settings/:subPage" binding={binding.sub('userData')} component="module/as_manager/pages/settings/settings_page" />

						<Route path="/pupil" binding={binding.sub('pupilPage')} component="module/as_manager/pages/pupil/pupil_page" />

						<Route path="/profile/:schoolID" binding={binding.sub('schoolProfile')} component="module/as_manager/pages/school_profile/school_profile_page"  />

						<Route path="/school_admin/:subPage /school_admin/:subPage/:mode" binding={binding.sub('activeSchool')} component="module/as_manager/pages/school_admin/school_page"  />

						<Route path="/schools /schools/:subPage" binding={binding.sub('schoolsPage')} component="module/as_manager/pages/schools/schools_page"  />


                        <Route path="/events /events/:subPage" binding={binding.sub('events')} component="module/as_manager/pages/events/events"  />
                        <Route path="/event /event/:eventId /event/:eventId/:mode" binding={binding.sub('events')} component="module/as_manager/pages/event/event"  />

						<Route path="/invites /invites/:filter /invites/:inviteId/:mode" binding={binding.sub('invites')} component="module/as_manager/pages/invites/invites"  />
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
