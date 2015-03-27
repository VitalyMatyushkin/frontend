var StudentPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route');

StudentPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('studentsRouting') } binding={globalBinding}>
				<Route path="/school_admin/students" binding={binding.sub('studentsList')} formBinding={binding.sub('studentForm')} component="module/as_manager/pages/school_admin/students/students_list"  />
				<Route path="/school_admin/students/add"  binding={binding.sub('studentAdd')} component="module/as_manager/pages/school_admin/students/student_add"  />
				<Route path="/school_admin/students/edit" binding={binding.sub('studentForm')} component="module/as_manager/pages/school_admin/students/student_edit"  />
			</RouterView>
		)
	}
});


module.exports = StudentPage;
