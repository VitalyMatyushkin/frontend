var SettingsPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route'),
	SubMenu = require('module/ui/sub_menu');

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
		}/*,{
			href: '/#settings/privacy',
			name: 'Privacy',
			key: 'Privacy'
		}*/];
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			general: {
				generalRouting: {}
			},
			security: {
				securityRouting: {}
			},
			privacy: {
				privacyRouting: {}
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

				<div className="bSettingsPage">
					<RouterView routes={ binding.sub('settingsRouting') } binding={globalBinding}>
						<Route path="/settings/general" binding={binding.sub('userInfo')} component="module/pages/settings/general_page"  />
						<Route path="/settings/security" binding={binding.sub('security')} component="module/pages/settings/security_page"  />
					</RouterView>
				</div>


			</div>
		)
	}
});

// <Route path="/settings/privacy" binding={binding.sub('privacy')} component="module/pages/settings/privacy_page"  />


module.exports = SettingsPage;
