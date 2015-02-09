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
						<Route path="/me" component="module/pages/me" pageName="me"  />
						<Route binding={binding.sub('form.register')} path="/register" component="module/pages/register/user" pageName="register"  />
						<Route binding={binding.sub('userData')} path="/login" component="module/pages/login/user" pageName="login"  />

						<Route binding={binding.sub('schools')} path="/schools" component="module/pages/schools/list" pageName="schools"  />
						<Route binding={binding.sub('schools')} path="/schools/add" component="module/pages/schools/add" pageName="schoolsAdd"  />
					</RouterView>

				</div>
			</div>
		)
	}
});

//<Route path="/register" component="module/pages/register/school" pageName="register"  />

module.exports = Center;
