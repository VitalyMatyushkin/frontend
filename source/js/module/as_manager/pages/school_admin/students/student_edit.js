const 	StudentForm 	= require('module/as_manager/pages/school_admin/students/student_form'),
		React 			= require('react'),
		Immutable 		= require('immutable'),
		Promise			= require('bluebird');

/** Page to edit student details */
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
			window.Server.schoolStudent.get({schoolId: activeSchoolId, studentId: studentId}).then( studentUser => {
				return Promise.all([
					window.Server.schoolForm.get({schoolId: activeSchoolId, formId: studentUser.formId}),
					window.Server.schoolHouse.get({schoolId: activeSchoolId, houseId: studentUser.houseId})
				]).then( formAndHouseArray => {
					// TODO: populate house and form details
					studentUser.form 	= formAndHouseArray[0];
					studentUser.house 	= formAndHouseArray[1];
					self.initNextOfKin(studentUser);
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
	initNextOfKin:function(student){
		const nok = student.nextOfKin;

		if(nok && !nok.length){
			nok.push({
				relationship:   '',
				firstName:      '',
				lastName:       '',
				phone:          '',
				email:          ''
			});
		}

		for(let key in nok[0]){
			student['nok_'+key] = nok[0][key];
		}
	},
	saveNextOfKin:function(student){
		const nok = student.nextOfKin;

		for(let key in nok[0]){
			nok[0][key] = student['nok_'+key];
		}
	},
	submitEdit: function(data) {
		const 	self = this,
				globalBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId 	= globalBinding.get('userRules.activeSchoolId');

		self.saveNextOfKin(data);
		window.Server.schoolStudent.put({schoolId: activeSchoolId, studentId: self.studentId}, data).then( updResult => {
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
