var PermissionsSettingsPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route');

PermissionsSettingsPage = React.createClass({
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
		var self = this;

		data.id = self.userId;
		console.log(data)
		     /*
		self.userId && window.Server.user.put(self.userId, data).then(function() {

		});*/
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<div>
				<RouterView routes={ binding.sub('permissionsRouting') } binding={globalBinding}>
					<Route path="/settings/permissions" binding={binding.sub('permissionsList')} component="module/shared_pages/settings/permissions/permissions_list"  />
					<Route path="/settings/permissions/add" binding={binding.sub('permissionsAdd')} component="module/shared_pages/settings/permissions/permissions_add"  />
				</RouterView>
			</div>
		)
	}
});


module.exports = PermissionsSettingsPage;
