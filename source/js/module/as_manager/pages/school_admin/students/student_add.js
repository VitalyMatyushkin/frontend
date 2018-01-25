const	React				= require('react'),
		Morearty			= require('morearty'),
		StudentForm			= require('module/as_manager/pages/school_admin/students/student_form'),
		StudentsFormHelper	= require('./students_form_helper');

/** Page to add new student to school */
const StudentAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const	globalBinding	= this.getMoreartyContext().getBinding(),
				activeSchoolId	= globalBinding.get('userRules.activeSchoolId');

		this.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data){
		const	binding					= this.getDefaultBinding(),
				countNextOfKinBlocks	= binding.toJS('countNextOfKinBlocks');

		StudentsFormHelper.convertNextOfKinToServerFormat(countNextOfKinBlocks, data);
		return window.Server.schoolStudents.post(this.activeSchoolId, data)
			.then(() => {
				document.location.hash = 'school_admin/students';

				return true;
			});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<StudentForm
				title			= "Add new student..."
				onFormSubmit	= { this.submitAdd }
				schoolId		= { this.activeSchoolId }
				binding			= { binding }
			/>
		)
	}
});

module.exports = StudentAddPage;