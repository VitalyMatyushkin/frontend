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
						<Route path="/me" component="module/pages/me/me" pageName="me"  />
						<Route binding={binding.sub('form.register')} path="/register" component="module/pages/register/user" pageName="register"  />
						<Route binding={binding.sub('userData')} path="/login" component="module/pages/login/user" pageName="login" loginRoute="true"  />

						<Route binding={binding.sub('schools.list')} path="/schools" component="module/pages/schools/list" pageName="schools"  />
						<Route binding={binding.sub('schools')} path="/schools/add" component="module/pages/schools/add" pageName="schoolsAdd"  />
						<Route binding={binding.sub('school')} path="/school" component="module/pages/schools/view" pageName="schoolOpen"  />

						<Route binding={binding.sub('class')} path="/class" component="module/pages/class/page" pageName="class"  />
						<Route binding={binding.sub('house')} path="/house" component="module/pages/house/page" pageName="house"  />
						<Route binding={binding.sub('leaner')} path="/leaner" component="module/pages/leaner/page" pageName="leaner"  />


                        <Route binding={binding.sub('events')} path="/events" component="module/pages/events/events_view" pageName="events_view"  />
                        <Route binding={binding.sub('events')} path="/events/calendar" component="module/pages/events/events_calendar" pageName="events_calendar"  />
                        <Route binding={binding.sub('events')} path="/events/challenges" component="module/pages/events/events_challenges" pageName="events_challenges"  />
                        <Route binding={binding.sub('events')} path="/events/invites" component="module/pages/events/events_view" pageName="events_view"  />

					</RouterView>

				</div>
			</div>
		)
	}
});

//<Route path="/register" component="module/pages/register/school" pageName="register"  />

module.exports = Center;
