import * as React from 'react';
import * as Immutable from 'immutable';
import * as Morearty from 'morearty';
import * as BPromise  from  'bluebird';

import * as StudentsFormHelper from 'module/as_manager/pages/school_admin/students/students_form_helper';
import * as StudentForm from 'module/as_manager/pages/school_admin/students/student_form';

export const StudentEdit = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount() {
		if(typeof this.getSchoolIdFromUrl() !== 'undefined' && typeof this.getStudentIdFromUrl() !== 'undefined') {
			this.setStudentData();
		}
	},
	getSchoolIdFromUrl() {
		return this.getMoreartyContext().getBinding().get('routing.pathParameters.0');
	},
	getStudentIdFromUrl() {
		return this.getMoreartyContext().getBinding().get('routing.pathParameters.3');
	},
	setStudentData() {
		const binding = this.getDefaultBinding();

		const schoolId = this.getSchoolIdFromUrl();
		const studentId = this.getStudentIdFromUrl();
		
		let student;

		window.Server.schoolStudent.get(
			{
				schoolId:	schoolId,
				studentId:	studentId
			}
			)
			.then(_student => {
				student = _student;

				const formPromise = (
						student.formId ?
							window.Server.schoolForm.get(
								{
									schoolId:	schoolId,
									formId:		student.formId
								}
							):
							BPromise.resolve(undefined)
					),
					housePromise = (
						student.houseId ?
							window.Server.schoolHouse.get(
								{
									schoolId:	schoolId,
									houseId:	student.houseId
								}
							):
							BPromise.resolve(undefined)
					);

				return BPromise.all([
					formPromise,
					housePromise
				]);
			})
			.then(formAndHouseArray => {
				// TODO: populate house and form details
				student.form 	= formAndHouseArray[0];
				student.house 	= formAndHouseArray[1];
				StudentsFormHelper.convertNextOfKinToClientFormat(student);

				binding.set('isSync', true);
				binding.set('countNextOfKinBlocks', Immutable.fromJS(StudentsFormHelper.getInitValueNextOfKinCount(student)));
				binding.set('studentForm', Immutable.fromJS(student));

				return true;
			});
	},
	submitEdit(data) {
		const binding = this.getDefaultBinding();

		if (data.avatar === null) {
			delete data.avatar;
		}

		const countNextOfKinBlocks = binding.toJS('countNextOfKinBlocks');
		const schoolId = this.getSchoolIdFromUrl();
		const studentId = this.getStudentIdFromUrl();

		StudentsFormHelper.convertNextOfKinToServerFormat(countNextOfKinBlocks, data);

		return window.Server.schoolStudent.put({schoolId, studentId}, data)
			.then(() => {
				document.location.hash = `school_sandbox/${this.getSchoolIdFromUrl()}/students`;
				
				return true;
			});
	},
	render() {
		const binding = this.getDefaultBinding();

		if(binding.toJS('isSync')) {
			return (
				<StudentForm
					title			= "Student"
					initialForm		= { binding.toJS('studentForm.form') }
					initialHouse	= { binding.toJS('studentForm.house') }
					onFormSubmit	= { this.submitEdit }
					schoolId		= { this.getSchoolIdFromUrl() }
					binding			= { binding }
				/>
			)
		} else {
			return null;
		}
	}
});