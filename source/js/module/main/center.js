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

						<Route path="/register"  binding={binding.sub('form.register')} component="module/pages/register/user" unauthorizedAccess={true}  />
						<Route path="/login" binding={binding.sub('userData')} component="module/pages/login/user" loginRoute={true}  />
						<Route path="/logout" binding={binding.sub('userData')} component="module/pages/logout/logout" unauthorizedAccess={true}  />
						<Route path="/settings /settings/:subPage" binding={binding.sub('userData')} component="module/pages/settings/settings_page" />

						<Route path="/pupil" binding={binding.sub('pupilPage')} component="module/pages/pupil/pupil_page" />

						<Route path="/school/:subPage /school/:subPage/:mode" binding={binding.sub('activeSchool')} component="module/pages/school/school_page"  />

						<Route path="/schools /schools/:subPage" binding={binding.sub('schoolsList')} component="module/pages/schools/schools_page"  />


                        <Route path="/events /events/:subPage" binding={binding} component="module/pages/events/events"  />
                        <Route path="/event /event/:eventId /event/:eventId/:mode" binding={binding.sub('events')} component="module/pages/event/event"  />

						<Route path="/invites /invites/:filter /invites/:inviteId/:mode" binding={binding.sub('invites')} component="module/pages/invites/invites"  />
                    </RouterView>

				</div>
			</div>
		)
	}
});

/*
 <Route path="/leaner" binding={binding.sub('leaner')} component="module/pages/leaner/page" />

 <Route path="/schools" binding={binding.sub('schoolsList')} component="module/pages/schools/page"  />


 <Route path="/schools/view" binding={binding.sub('school')} component="module/pages/school/page"  />

 */
//<Route path="/register" component="module/pages/register/school" pageName="register"  />
//<Route binding={binding.sub('schoolsList')} path="/schools/add" component="module/pages/schools/add" pageName="schoolsAdd"  />
//<Route path="/me" component="module/pages/me/me" pageName="me"  />

module.exports = Center;
