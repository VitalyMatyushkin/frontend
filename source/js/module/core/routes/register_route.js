const 	React = require('react'),
		Route = require('module/core/route');

const RegisterRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: '/register',
			component: 'module/ui/register/user',
			unauthorizedAccess: true
		};
	},
	render: function() {
		null
	}
});

module.exports = RegisterRoute;