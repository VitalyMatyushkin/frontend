/**
 * Created by vitaly on 23.08.17.
 */
const	React 					= require('react'),
		Morearty				= require('morearty'),
		RouterView 				= require('module/core/router'),
		Route 					= require('module/core/route'),
		{StudentsList}			= require('module/as_admin/pages/admin_schools/school_sandbox/students/students-list'),
		{StudentAdd} 	        = require('module/as_admin/pages/admin_schools/school_sandbox/students/student_add'),
		{StudentEdit} 	        = require('module/as_admin/pages/admin_schools/school_sandbox/students/student_edit'),
		StudentMergeComponent 	= require('module/as_admin/pages/admin_schools/school_sandbox/students/student_merge');

const StudentsPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();
		const globalBinding = this.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('studentsRouting') } binding={globalBinding}>
				<Route
					path 		= "/school_sandbox/:schoolId/students"
					binding 	= { binding.sub('studentList') }
					component 	= { StudentsList }
				/>
				<Route
					path 		= "/school_sandbox/:schoolId/students/add"
					binding 	= { binding.sub('studentAdd') }
					component 	= { StudentAdd }
				/>
				<Route
					path 		= "/school_sandbox/:schoolId/students/edit/:studentId"
					binding 	= { binding.sub('studentEdit') }
					component 	= { StudentEdit }
				/>
				<Route
					path 		= "/school_sandbox/:schoolId/students/merge/:studentId"
					binding 	= { binding.sub('studentMerge') }
					component 	= { StudentMergeComponent }
				/>
			</RouterView>
		)
	}
});


module.exports = StudentsPage;