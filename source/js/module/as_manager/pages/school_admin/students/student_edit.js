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
					include: ["user", "house", "school"]
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
		var self = this;
		window.Server.user.put({
			id:data.userId
		},{
			firstName:data.firstName,
			lastName:data.lastName,
			birthday:data.birthday,
			gender:data.gender
		}).then(function(userDetails){
			window.Server.student.put({studentId:self.studentId},{
				formId:data.formId,
				houseId:data.houseId,
				schoolId:data.schoolId,
				nextOfKin:[{
					name:data.name
				}],
				medicalInfo:{
					allergy:data.allergy
				}
			}).then(function(studentDetails){
				self.isMounted() && (document.location.hash = 'school_admin/students');
				return studentDetails;
			}).catch((error)=>{
				alert(error.errorThrown+' occurred while updating student details');
				self.isMounted() && (document.location.hash = 'school_admin/students');
			});
			return userDetails;
		}).catch((error)=>{
			alert(error.errorThrown+' occurred while updating user');
			self.isMounted() && (document.location.hash = 'school_admin/students');
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<StudentForm title="Student" onFormSubmit={self.submitEdit} schoolId={self.activeSchoolId} binding={binding} />
		)
	}
});


module.exports = StudentEditPage;
