var SettingsPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route'),
	SubMenu = require('module/ui/menu/sub_menu');

SettingsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		// Пункты подменю
		self.menuItems = [{
			href: '/#settings/general',
			name: 'General',
			key: 'General'
		},{
			href: '/#settings/security',
			name: 'Security',
			key: 'Security'
		},{
			href: '/#settings/permissions',
			name: 'Permissions',
			key: 'Permissions'
		}];
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			general: {
				generalRouting: {}
			},
			security: {
				securityRouting: {}
			},
			permissions: {
				permissionsRouting: {}
			},
			settingsRouting: {}
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<div>
				<SubMenu binding={binding.sub('settingsRouting')} items={self.menuItems} />

				<div className="bSchoolMaster">
					<RouterView routes={ binding.sub('settingsRouting') } binding={globalBinding}>
						<Route path="/settings/general" binding={binding.sub('userInfo')} component="module/shared_pages/settings/general_page"  />
						<Route path="/settings/security" binding={binding.sub('security')} component="module/shared_pages/settings/security_page"  />
						<Route path="/settings/permissions" binding={binding.sub('permissions')} component="module/shared_pages/settings/permissions_page"  />
					</RouterView>
				</div>


			</div>
		)
	}
});

// <Route path="/settings/privacy" binding={binding.sub('privacy')} component="module/as_manager/pages/settings/privacy_page"  />


module.exports = SettingsPage;
