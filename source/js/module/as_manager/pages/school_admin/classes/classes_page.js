const 	React 					= require('react'),
		RouterView 				= require('module/core/router'),
		Morearty				= require('morearty'),
		Route 					= require('module/core/route'),
		ClassesListComponent 	= require("module/as_manager/pages/school_admin/classes/list/class-list"),
		ClassAddComponent 		= require("module/as_manager/pages/school_admin/classes/class_add"),
		ClassEditComponent 		= require("module/as_manager/pages/school_admin/classes/class_edit"),
		ClassStudentsComponent 	= require("module/as_manager/pages/school_admin/classes/class-students");

const ClassesPage = React.createClass({
	mixins: [Morearty.Mixin],
	//The function, which will call when user click on <Row> with Form in Grid
	handleClickForm: function(formId, formName) {
		document.location.hash = 'school_admin/forms/students?id=' + formId + '&name=' + formName;
	},
	//The function, which will call when user click on <Row> with list of student in Grid
	handleClickStudent: function(studentId) {
		document.location.hash = 'school_admin/students/stats?id=' + studentId;
	},
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('classesRouting') } binding={globalBinding}>
				<Route
					path			= "/school_admin/forms"
					binding			= { binding.sub('classesList') }
					formBinding		= { binding.sub('classesForm') }
					component		= { ClassesListComponent }
					handleClick		= { this.handleClickForm }
				/>
				<Route
					path		= "/school_admin/forms/add"
					binding		= { binding.sub('classAdd') }
					component	= { ClassAddComponent }
				/>
				<Route
					path		= "/school_admin/forms/edit"
					binding		= { binding.sub('classEdit') }
					component	= { ClassEditComponent }
				/>
				<Route
					path		= "/school_admin/forms/students"
					binding		= { binding.sub('classStudents') }
					component	= { ClassStudentsComponent }
					handleClick	= { this.handleClickStudent }
				/>
			</RouterView>
		)
	}
});


module.exports = ClassesPage;
