const 	React 				= require('react'),
		Immutable 			= require('immutable'),
		Morearty			= require('morearty'),
		Promise				= require('bluebird'),
		StudentsFormHelper	= require('./students_form_helper'),
		StudentForm 		= require('module/as_manager/pages/school_admin/students/student_form');

/** Page to edit student details */
const StudentEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const	activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				studentId 		= this.getStudentIdFromUrl();

		// loading student data
		if(
			typeof activeSchoolId !== 'undefined' &&
			typeof studentId !== 'undefined'
		) {
			this.activeSchoolId = activeSchoolId;
			this.studentId = studentId;

			this.setStudentData();
		}
	},
	getStudentIdFromUrl: function() {
		return this.getMoreartyContext().getBinding().sub('routing.parameters').toJS().id;
	},
	setStudentData: function() {
		const	binding		= this.getDefaultBinding(),
				studentId	= this.getStudentIdFromUrl();

		let student;

		window.Server.schoolStudent.get(
				{
					schoolId:	this.activeSchoolId,
					studentId:	studentId
				}
			)
			.then(_student => {
				student = _student;

				const formPromise = (
						student.formId ?
							window.Server.schoolForm.get(
								{
									schoolId:	this.activeSchoolId,
									formId:		student.formId
								}
							):
							Promise.resolve(undefined)
					),
					housePromise = (
						student.houseId ?
							window.Server.schoolHouse.get(
								{
									schoolId:	this.activeSchoolId,
									houseId:	student.houseId
								}
							):
							Promise.resolve(undefined)
					);

				return Promise.all([
					formPromise,
					housePromise
				]);
			})
			.then(formAndHouseArray => {
				// TODO: populate house and form details
				student.form 	= formAndHouseArray[0];
				student.house 	= formAndHouseArray[1];
				StudentsFormHelper.convertNextOfKinToClientFormat(student);

				binding.atomically()
					.set('isSync', true)
					.set(
						'countNextOfKinBlocks',
						Immutable.fromJS(
							StudentsFormHelper.getInitValueNextOfKinCount(student)
						)
					)
					.set(
						'studentForm',
						Immutable.fromJS(student)
					)
					.commit();

				return true;
			});
	},
	submitEdit: function(data) {
		const	binding					= this.getDefaultBinding(),
				globalBinding			= this.getMoreartyContext().getBinding(),
				activeSchoolId			= globalBinding.get('userRules.activeSchoolId'),
				countNextOfKinBlocks	= binding.toJS('countNextOfKinBlocks');
		
		if (data.avatar === null) {
			delete data.avatar;
		}

		StudentsFormHelper.convertNextOfKinToServerFormat(countNextOfKinBlocks, data);
		return window.Server.schoolStudent.put({schoolId: activeSchoolId, studentId: this.studentId}, data)
			.then(() => {
				document.location.hash = 'school_admin/students';
				return true;
			});
	},
	render: function() {
		const	binding			= this.getDefaultBinding(),
				initialForm		= binding.toJS('studentForm.form'),
				initialHouse	= binding.toJS('studentForm.house');

		if(binding.toJS('isSync')) {
			return (
				<StudentForm
					title			= "Student"
					initialForm		= { initialForm }
					initialHouse	= { initialHouse }
					onFormSubmit	= { this.submitEdit }
					schoolId		= { this.activeSchoolId }
					binding			= { binding }
				/>
			)
		} else {
			return null;
		}
	}
});

module.exports = StudentEditPage;