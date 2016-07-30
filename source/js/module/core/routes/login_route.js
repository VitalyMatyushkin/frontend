const 	React 			= require('react'),
		Route 			= require('module/core/route'),
		LoginComponent 	= require('module/ui/login/user');

const LoginRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: '/login',
			component: LoginComponent,
			loginRoute: true
		};
	},
	render: function() {
		null;
	}
});

module.exports = LoginRoute;


