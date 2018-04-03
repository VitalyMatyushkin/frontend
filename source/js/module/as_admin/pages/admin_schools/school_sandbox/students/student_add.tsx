import * as React from 'react';
import * as Morearty from 'morearty';

import * as StudentsFormHelper from 'module/as_manager/pages/school_admin/students/students_form_helper';
import * as StudentForm from 'module/as_manager/pages/school_admin/students/student_form';

import {AdminServiceList} from "module/core/service_list/admin_service_list";

export const StudentAdd = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getSchoolIdFromUrl() {
		return this.getMoreartyContext().getBinding().get('routing.pathParameters.0');
	},
	submitAdd(data) {
		const binding = this.getDefaultBinding();

		if (data.avatar === null) {
			delete data.avatar;
		}

		const countNextOfKinBlocks = binding.toJS('countNextOfKinBlocks');
		const schoolId = this.getSchoolIdFromUrl();

		StudentsFormHelper.convertNextOfKinToServerFormat(countNextOfKinBlocks, data);

		return (window.Server as AdminServiceList).schoolStudents.post({schoolId}, data)
			.then(() => {
				document.location.hash = `school_sandbox/${this.getSchoolIdFromUrl()}/students`;
				
				return true;
			});
	},
	render() {
		const binding = this.getDefaultBinding();

		return (
			<StudentForm
				title			= "Student"
				initialForm		= { binding.toJS('studentForm.form') }
				initialHouse	= { binding.toJS('studentForm.house') }
				onFormSubmit	= { (data) => this.submitAdd(data) }
				schoolId		= { this.getSchoolIdFromUrl() }
				binding			= { binding }
			/>
		)
	}
});