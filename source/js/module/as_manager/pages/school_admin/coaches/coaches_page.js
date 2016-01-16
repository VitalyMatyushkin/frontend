var CoachesPage,
	RouterView = require('module/core/router'),
	React = require('react'),
	Route = require('module/core/route');

CoachesPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('coachesRouting') } binding={globalBinding}>
				<Route path="/school_admin/coaches" addSchoolToFilter={false} binding={binding.sub('coachesList')} formBinding={binding.sub('coachesForm')} component="module/as_manager/pages/school_admin/coaches/coaches_list"  />
				<Route path="/school_admin/coaches/add"  binding={binding.sub('coachesAdd')} component="module/as_manager/pages/school_admin/coaches/coaches_add"  />
				<Route path="/school_admin/coaches/edit" binding={binding.sub('coachesForm')} component="module/as_manager/pages/school_admin/coaches/coaches_edit"  />
			</RouterView>
		)
	}
});


module.exports = CoachesPage;
