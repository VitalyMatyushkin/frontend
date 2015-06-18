var RegisterRoute,
	Route = require('module/core/route');

RegisterRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: '/register',
			component: 'module/ui/register/user',
			unauthorizedAccess: true
		};
	},
	render: function() {
		var self = this;

		null
	}
});

module.exports = RegisterRoute;