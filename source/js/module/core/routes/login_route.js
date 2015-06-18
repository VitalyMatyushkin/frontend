var LoginRoute,
	Route = require('module/core/route');

LoginRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: '/login',
			component: 'module/ui/login/user',
			loginRoute: true
		};
	},
	render: function() {
		var self = this;

		null
	}
});

module.exports = LoginRoute;


