const 	RouterView 				= require('module/core/router'),
		React 					= require('react'),
		Morearty				= require('morearty'),
		Route 					= require('module/core/route'),
		StudentsListComponent 	= require("module/as_manager/pages/school_admin/students/list/student-list"),
		StudentsAddComponent 	= require("module/as_manager/pages/school_admin/students/student_add"),
		StudentsEditComponent 	= require("module/as_manager/pages/school_admin/students/student_edit"),
		StudentStatsComponent 	= require('module/as_manager/pages/school_admin/students/student-statistic');


const StudentPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('studentsRouting') } binding={globalBinding}>
				<Route path="/school_admin/students" binding={binding.sub('studentsList')} component={StudentsListComponent}  />
				<Route path="/school_admin/students/add"  binding={binding.sub('studentAdd')} component={StudentsAddComponent} />
				<Route path="/school_admin/students/edit" binding={binding.sub('studentForm')} component={StudentsEditComponent}  />
				<Route path="/school_admin/students/stats" binding={binding.sub('studentStats')} component={StudentStatsComponent}/>
			</RouterView>
		)
	}
});


module.exports = StudentPage;
