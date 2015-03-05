var RouterView = require('module/core/router'),
	Route = require('module/core/route'),
	Center;

Center = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			currentPage =  binding.sub('routing').get('current_page'),
			mainClass = 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

		return (
			<div className={mainClass}>
				<div className="bPageWrap">

					<RouterView routes={ binding.sub('routing') } binding={binding}>

						<Route path="/register"  binding={binding.sub('form.register')} component="module/pages/register/user" unauthorizedAccess={true} pageName="register"  />
						<Route path="/login" binding={binding.sub('userData')} component="module/pages/login/user" pageName="login" loginRoute={true}  />

						<Route path="/schools" binding={binding.sub('schoolsList')} component="module/pages/schools/page" pageName="schoolsController"  />
						<Route path="/schools/add" binding={binding.sub('schoolsList')} component="module/pages/schools/add" pageName="schoolsAdd"  />
						<Route path="/schools/list" binding={binding.sub('schoolsList')} component="module/pages/schools/list" pageName="schoolsList"  />

						<Route path="/school" binding={binding.sub('school')} component="module/pages/school/page" pageName="school"  />

						<Route path="/class" binding={binding.sub('class')} component="module/pages/class/page" pageName="class"  />
						<Route path="/house" binding={binding.sub('house')} component="module/pages/house/page" pageName="house"  />
						<Route path="/leaner" binding={binding.sub('leaner')} component="module/pages/leaner/page" pageName="leaner"  />

                        <Route path="/events" binding={binding.sub('events')} component="module/pages/events/events_calendar" pageName="events_calendar"  />
                        <Route path="/events/manager" binding={binding.sub('events')} component="module/pages/events/event_manager" pageName="event_manager"  />
                        <Route path="/events/calendar"  binding={binding.sub('events')}component="module/pages/events/events_calendar" pageName="events_calendar"  />
                        <Route path="/events/challenges" binding={binding.sub('events')} component="module/pages/events/events_challenges" pageName="events_challenges"  />
                        <Route path="/events/invites" binding={binding.sub('invites')} component="module/pages/events/events_invites" pageName="events_invites"  />
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
