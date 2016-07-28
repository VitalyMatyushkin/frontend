const 	React 			= require('react'),
		Route	 		= require('module/core/route'),
		RegisterUser 	= require('module/ui/register/user');

const RegisterRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: 		'/register',
			component: 	RegisterUser,
			unauthorizedAccess: true
		};
	},
	render: function() {
		null
	}
});

module.exports = RegisterRoute;