const 	React 			= require('react'),
		Route 			= require('module/core/route'),
		LogoutComponent = require('module/ui/logout/logout');

const LogoutRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: '/logout',
			component: LogoutComponent,
			unauthorizedAccess: true
		};
	},
	render: function() {
		null;
	}
});

module.exports = LogoutRoute;
