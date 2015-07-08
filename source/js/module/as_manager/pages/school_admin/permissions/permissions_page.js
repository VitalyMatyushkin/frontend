var CoachesPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route');

CoachesPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('coachesRouting') } binding={globalBinding}>
				<Route path="/school_admin/permissions" binding={binding.sub('permissionsList')} component="module/as_manager/pages/school_admin/permissions/permissions_list"  />
				<Route path="/school_admin/permissions/add"  binding={binding.sub('permissionsAdd')} component="module/as_manager/pages/school_admin/permissions/permissions_add"  />
				<Route path="/school_admin/permissions/edit" binding={binding.sub('permissionsForm')} component="module/as_manager/pages/school_admin/permissions/permissions_edit"  />
			</RouterView>
		)
	}
});


module.exports = CoachesPage;
