const 	RouterView 	= require('module/core/router'),
		Route 		= require('module/core/route'),
		React 		= require('react'),
		Tabs		= require('module/ui/tabs/tabs'),
		Morearty	= require('morearty'),
		Immutable 	= require('immutable'),
		GeneralPageComponent 			= require("module/shared_pages/settings/general/general_page"),
		ChangePasswordPageComponent 	= require("module/shared_pages/settings/password/change_password_page"),
		AccountRolesComponent 			= require("module/shared_pages/settings/account/account_roles"),
		AccountRequestsComponent 		= require("module/shared_pages/settings/account/account_requests");


const SettingsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const self = this,
			binding		= self.getDefaultBinding(),
			rootBinding	= self.getMoreartyContext().getBinding(),
			tab 		= rootBinding.get('routing.pathParameters.0');

		// tabListModel
		self.tabListModel = [{
			text: 'General',
			value: 'general',
			isActive:false
		},
		{
			text:'Roles',
			value:'roles',
			isActive:false
		},
		{
			text:'Requests',
			value:'requests',
			isActive:false
		},
		{
			text:'Change Password',
			value:'password',
			isActive:false
		}];
		if(tab) {
			let item = self.tabListModel.find(t => t.value === tab);
			item.isActive = true;
			binding.set('activeTab', tab);
		} else {
			self.tabListModel[0].isActive = true;
			binding.set('activeTab', 'general');
		}
	},
	changeActiveTab:function(item){
		const	self	= this,
			binding	= self.getDefaultBinding();

		binding.set('activeTab', item);

		window.location.hash = '#settings/' + item;
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
				<div className="bSettings_top">
					<div className="bSettings_name">
						{binding.get('userInfo.firstName')}
						{binding.get('userInfo.lastName')}
					</div>
					<Tabs binding={binding.sub('settingsRouting')} tabListModel={self.tabListModel}
						  onClick={self.changeActiveTab}/>
				</div>
				<div className="bSchoolMaster">
					<RouterView routes={ binding.sub('settingsRouting') } binding={globalBinding}>
						<Route
							path="/settings/general"
							binding={binding.sub('userInfo')}
							component={GeneralPageComponent}
						/>
						<Route
							path="/settings/password"
							binding={binding.sub('password')}
							component={ChangePasswordPageComponent}
						/>
						<Route
							path="/settings/roles"
							binding={binding.sub('roles')}
							component={AccountRolesComponent}
						/>
						<Route
							path="/settings/requests /settings/requests/:subPage"
							binding={binding.sub('requests')}
							component={AccountRequestsComponent}
						/>
					</RouterView>
				</div>
			</div>
		)
	}
});

module.exports = SettingsPage;