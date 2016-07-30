const 	React 		= require('react'),
		RouterView 	= require('module/core/router'),
		Route 		= require('module/core/route'),
		Morearty	= require('morearty'),
		Immutable 	= require('immutable'),
		PermissionsListComponent = require("module/shared_pages/settings/permissions/permissions_list"),
		PermissionsAddComponent = require("module/shared_pages/settings/permissions/permissions_add");


const PermissionsSettingsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			userId = globalBinding.get('userData.authorizationInfo.userId');

		if (userId) {
			window.Server.user.get(userId).then(function (data) {
				self.isMounted() && binding.set(Immutable.fromJS(data));
			});

			self.userId = userId;
		}
	},
	submitEdit: function(data) {
		data.id = this.userId;
	},
	render: function() {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding();

		return (
			<div>
				<RouterView routes={ binding.sub('permissionsRouting') } binding={globalBinding}>
					<Route path="/settings/permissions" binding={binding.sub('permissionsList')} component={PermissionsListComponent} />
					<Route path="/settings/permissions/add" binding={binding.sub('permissionsAdd')} component={PermissionsAddComponent} />
				</RouterView>
			</div>
		)
	}
});


module.exports = PermissionsSettingsPage;
