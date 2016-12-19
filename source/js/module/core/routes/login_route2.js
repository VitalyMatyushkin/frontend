const 	React 		= require('react'),
		Route 		= require('module/core/route'),
		loginUser2	= require('../../ui/login/user2');

//TODO does anybody know why it is done this way?
const LoginRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: 		'/login',
			component: 	loginUser2,
			loginRoute: true
		};
	},
	render: function() {
		return null;
	}
});

module.exports = LoginRoute;


