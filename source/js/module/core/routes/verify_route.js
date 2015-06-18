var VerifyRoute,
	Route = require('module/core/route');

VerifyRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: 'verify',
			component: 'module/ui/register/user/register_done',
			verifyRoute: true
		};
	},
	render: function() {
		var self = this;

		null
	}
});

module.exports = VerifyRoute;

