var SettingsRoute,
	React = require('react'),
	Route = require('module/core/route');

SettingsRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: '/settings /settings/:subPage /settings/:subPage/:actionPage',
			component: 'module/shared_pages/settings/settings_page',
			unauthorizedAccess: false
		};
	},
	render: function() {
		var self = this;

		null
	}
});

module.exports = SettingsRoute;
