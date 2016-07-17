const 	React = require('react'),
		Route = require('module/core/route');

const LoginRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: 		'/login',
			component: 	'module/ui/login/user2',
			loginRoute: true
		};
	},
	render: function() {
		return null;
	}
});

module.exports = LoginRoute;


