var LogoutRoute,
	React = require('react'),
	Route = require('module/core/route');

LogoutRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: '/logout',
			component: 'module/ui/logout/logout',
			unauthorizedAccess: true
		};
	},
	render: function() {
		var self = this;

		null
	}
});

module.exports = LogoutRoute;
