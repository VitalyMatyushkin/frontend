const 	StudentForm 	= require('module/as_manager/pages/school_admin/students/student_form'),
		React 			= require('react'),
		Immutable 		= require('immutable'),
		Promise			= require('bluebird');

const StudentEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId 	= globalBinding.get('userRules.activeSchoolId'),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				studentId 		= routingData.id;

		self.activeSchoolId = activeSchoolId;
		binding.clear();

		// loading student data
		if(activeSchoolId && studentId) {
			window.Server.student.get({schoolId: activeSchoolId, studentId: studentId}).then( studentUser => {
				return Promise.all([
					window.Server.schoolForm.get({schoolId: activeSchoolId, formId: studentUser.formId}),
					window.Server.schoolHouse.get({schoolId: activeSchoolId, houseId: studentUser.houseId})
				]).then( formAndHouseArray => {
					// TODO: populate house and form details
					self.isMounted() && binding.set(Immutable.fromJS(studentUser));
					return studentUser;
				});

			}).catch( err => {
				alert(err.errorThrown + ' server error occurred while getting student data');
			});

			self.activeSchoolId = activeSchoolId;
			self.studentId = studentId;
		}
	},

	submitEdit: function(data) {
		const 	self = this,
				globalBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId 	= globalBinding.get('userRules.activeSchoolId');

		data.birthday = data.birthday.substr(0, data.birthday.indexOf('T'));    // TODO: fix that hack
		window.Server.student.put({schoolId: activeSchoolId, studentId: self.studentId}, data).then( updResult => {
			self.isMounted() && (document.location.hash = 'school_admin/students');
			return;
		});

	},

	render: function() {
		const 	self 				= this,
				binding 			= self.getDefaultBinding(),
				initialForm 		= binding.toJS('form'),
				initialHouse		= binding.toJS('house');

		return (
			<StudentForm
				title				= "Student"
				initialForm			= {initialForm}
				initialHouse		= {initialHouse}
				onFormSubmit		= {self.submitEdit}
				schoolId			= {self.activeSchoolId}
				binding				= {binding}
			/>
		)
	}
});


module.exports = StudentEditPage;
