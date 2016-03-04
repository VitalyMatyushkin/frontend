const 	StudentForm 	= require('module/as_manager/pages/school_admin/students/student_form'),
		React 			= require('react'),
		Immutable 		= require('immutable');

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

		if (activeSchoolId && studentId) {
			window.Server.student.get(studentId, {
				filter: {
					include: ["user", "house", "school", "form"]
				}
			}).then(studentUser => {
				studentUser.firstName 	= studentUser.user.firstName;
				studentUser.lastName 	= studentUser.user.lastName;
				studentUser.birthday 	= studentUser.user.birthday;
				studentUser.gender 		= studentUser.user.gender;
				studentUser.name 		= studentUser.nextOfKin !== undefined ? studentUser.nextOfKin[0].name : '';
				studentUser.allergy 	= studentUser.medicalInfo !== undefined ? studentUser.medicalInfo.allergy : '';
				self.isMounted() && binding.set(Immutable.fromJS(studentUser));
				return studentUser;
			})
			.catch( err => {
				alert(err.errorThrown + ' server error occurred while getting student data');
			});

			self.activeSchoolId = activeSchoolId;
			self.studentId = studentId;
		}
	},

	submitEdit: function(data) {
		const self = this;

		window.Server.studentUpdate.put({studentId: self.studentId}, {
			schoolId:		data.schoolId,
			formId: 		data.formId,
			houseId:		data.houseId,
			nextOfKin:		[{name: data.name}],
			medicalInfo: 	{ allergy: data.allergy },
			firstName:		data.firstName,
			lastName:		data.lastName,
			birthday:		data.birthday,
			gender:			data.gender
		}).then( updResult => {
			self.isMounted() && (document.location.hash = 'school_admin/students');
			console.log('updated!');
			return;
		});

	},

	render: function() {
		const 	self 				= this,
				binding 			= self.getDefaultBinding(),
				initialForm 		= binding.get('form') && binding.get('form').toJS(),
				initialHouse		= binding.get('house') && binding.get('house').toJS();

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
