const 	RouterView = require('module/core/router'),
		Route = require('module/core/route'),
		React = require('react'),
		SubMenu = require('module/ui/menu/sub_menu'),
		Immutable 	= require('immutable');

const SettingsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const self = this;

		// menu subitems
		self.menuItems = [{
			href: '/#settings/general',
			name: 'General',
			key: 'General'
		},
		{
			href:'/#settings/roles',
			name:'Roles',
			key:'Roles'
		},
		{
			href:'/#settings/requests',
			name:'Requests',
			key:'Requests'
		},
		{
			href:'/#settings/password',
			name:'Change Password',
			key:'Password'
		},
		{
			key: 'goback',
			name: '← GO BACK',
			href: '#'}
		];
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			general: {
				generalRouting: {}
			},
			password: {
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
						<Route
							path="/settings/general"
							binding={binding.sub('userInfo')}
							component="module/shared_pages/settings/general/general_page"
						/>
						<Route
							path="/settings/password"
							binding={binding.sub('password')}
							component="module/shared_pages/settings/password/change_password_page"
						/>
						<Route
							path="/settings/roles"
							binding={binding.sub('roles')}
							component="module/shared_pages/settings/account/account_roles"
						/>
						<Route
							path="/settings/requests /settings/requests/:subPage"
							binding={binding.sub('requests')}
							component="module/shared_pages/settings/account/account_requests"
						/>
						<Route
							path="/settings/permissions /settings/permissions/:subPage"
							binding={binding.sub('permissions')}
							component="module/shared_pages/settings/permissions/permissions_page"
						/>
					</RouterView>
				</div>
			</div>
		)
	}
});

module.exports = SettingsPage;