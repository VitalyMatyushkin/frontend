var RouterView = require('module/core/router'),
	Route = require('module/core/route'),
	Center;

Center = React.createClass({
	mixins: [Morearty.Mixin],
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

						<Route path="/schools" binding={binding.sub('schoolsList')} component="module/pages/schools/page"  />
						<Route path="/schools/add" binding={binding.sub('schoolsList')} component="module/pages/schools/add"  />
						<Route path="/schools/list" binding={binding.sub('schoolsList')} component="module/pages/schools/list" />

						<Route path="/schools/view" binding={binding.sub('school')} component="module/pages/school/page"  />

						<Route path="/class" binding={binding.sub('class')} component="module/pages/class/page"  />
						<Route path="/house" binding={binding.sub('house')} component="module/pages/house/page"  />
						<Route path="/leaner" binding={binding.sub('leaner')} component="module/pages/leaner/page" />

                        <Route path="/events" binding={binding.sub('events')} component="module/pages/events/events_calendar"  />
                        <Route path="/events/manager" binding={binding.sub('events')} component="module/pages/events/event_manager"  />
                        <Route path="/events/calendar"  binding={binding.sub('events')}component="module/pages/events/events_calendar"   />
                        <Route path="/events/challenges" binding={binding.sub('events')} component="module/pages/events/events_challenges"  />
                        <Route path="/events/invites" binding={binding.sub('invites')} component="module/pages/events/events_invites"  />
                        <Route path="/events/view" binding={binding.sub('events')} component="module/pages/events/view"  />
                    </RouterView>

				</div>
			</div>
		)
	}
});

//<Route path="/register" component="module/pages/register/school" pageName="register"  />
//<Route binding={binding.sub('schoolsList')} path="/schools/add" component="module/pages/schools/add" pageName="schoolsAdd"  />
//<Route path="/me" component="module/pages/me/me" pageName="me"  />

module.exports = Center;
