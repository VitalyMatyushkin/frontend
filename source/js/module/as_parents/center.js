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
						<Route path="/ /login" binding={binding.sub('userData')} component="module/as_manager/pages/login/user" loginRoute={true}  />
						<Route path="/logout" binding={binding.sub('userData')} component="module/as_manager/pages/logout/logout" unauthorizedAccess={true}  />
						<Route path="/test" binding={binding.sub('schoolProfile')} component="module/as_parents/pages/school/school_page"  />
                    </RouterView>

				</div>
			</div>
		)
	}
});


module.exports = Center;
