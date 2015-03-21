var PupilPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route');

PupilPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('pupilsRouting') } binding={globalBinding}>
				<Route path="/school_admin/pupils" binding={binding.sub('pupilsList')} formBinding={binding.sub('pupilForm')} component="module/manager_mode/pages/school_admin/pupils/pupils_list"  />
				<Route path="/school_admin/pupils/add"  binding={binding.sub('pupilAdd')} component="module/manager_mode/pages/school_admin/pupils/pupil_add"  />
				<Route path="/school_admin/pupils/edit" binding={binding.sub('pupilForm')} component="module/manager_mode/pages/school_admin/pupils/pupil_edit"  />
			</RouterView>
		)
	}
});


module.exports = PupilPage;
