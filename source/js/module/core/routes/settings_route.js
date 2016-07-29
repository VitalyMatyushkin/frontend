const 	React 				= require('react'),
		Route 				= require('module/core/route'),
		SettingsComponent 	= require('module/shared_pages/settings/settings_page');

const SettingsRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: '/settings /settings/:subPage /settings/:subPage/:actionPage',
			component: SettingsComponent,
			unauthorizedAccess: false
		};
	},
	render: function() {
		null;
	}
});

module.exports = SettingsRoute;
