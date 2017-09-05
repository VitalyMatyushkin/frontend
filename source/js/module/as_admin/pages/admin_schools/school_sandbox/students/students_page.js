/**
 * Created by vitaly on 23.08.17.
 */
const	React 					= require('react'),
		Morearty				= require('morearty'),
		RouterView 				= require('module/core/router'),
		Route 					= require('module/core/route'),
		StudentsListComponent 	= require('module/as_admin/pages/admin_schools/school_sandbox/students/students-list'),
		StudentAddComponent 	= require('module/as_admin/pages/admin_schools/school_sandbox/students/student_add'),
		SVG						= require('module/ui/svg');

const StudentsPage = React.createClass({
	mixins: [Morearty.Mixin],
	createNewStudent: function(){
		document.location.hash = document.location.hash +'/add';
	},
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				subBinding 		= binding.sub('classesRouting'),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				addButton 		= <div className="addButtonShort" onClick={this.createNewStudent}><SVG icon="icon_add_student" /></div>;


		return (
			<RouterView routes={ subBinding.sub('routing') } binding={globalBinding}>
				<Route path="/school_sandbox/:schoolId/students" binding={subBinding.sub('studentList')} component={StudentsListComponent}/>
				<Route path="/school_sandbox/:schoolId/students/add"  binding={subBinding} component={StudentAddComponent}  />
			</RouterView>
		)
	}
});


module.exports = StudentsPage;