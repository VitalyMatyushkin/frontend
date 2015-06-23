var SettingsRoute,
	Route = require('module/core/route');

SettingsRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: '/settings /settings/:subPage',
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
