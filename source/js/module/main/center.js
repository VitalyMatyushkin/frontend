var RouterView = require('module/core/router'),
	Route = require('module/core/route'),
	Center;

Center = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bMainLayout mClearFix">
				<div className="bPageWrap">

					<RouterView routes={ binding.sub('routing') } binding={binding}>
						<Route path="/me" component="module/pages/me" pageName="me"  />
						<Route path="page2" component="module/pages/page2" pageName="page2"  />
					</RouterView>

				</div>
			</div>
		)
	}
});

module.exports = Center;
