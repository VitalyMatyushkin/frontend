const 	StudentForm 	= require('module/as_manager/pages/school_admin/students/student_form'),
		React 			= require('react'),
		Immutable 		= require('immutable');

const StudentEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId'),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			studentId = routingData.id;
		self.activeSchoolId = activeSchoolId;
		binding.clear();

		if (activeSchoolId && studentId) {
			window.Server.student.get(studentId).then(function (data) {
				window.Server.user.get(data.userId).then(function (userdata) {
					//TODO use filter include
					data.firstName = userdata.firstName;
					data.lastName = userdata.lastName;
					data.birthday = userdata.birthday;
					data.gender = userdata.gender;
					data.name = data.nextOfKin !== undefined?data.nextOfKin[0].name:'';
					data.surname = data.nextOfKin !== undefined?data.nextOfKin[0].surname:'';
					data.allergy = data.medicalInfo!==undefined?data.medicalInfo.allergy:'';
					data.injures = data.medicalInfo!==undefined?data.medicalInfo.injures:'';
					data.role = data.nextOfKin !== undefined?data.nextOfKin[0].role:'';
					data.other = data.medicalInfo!==undefined?data.medicalInfo.other:'';
					self.isMounted() && binding.set(Immutable.fromJS(data));
					return userdata;
				});
				return data;
			});

			self.activeSchoolId = activeSchoolId;
			self.studentId = studentId;
		}
	},
	submitEdit: function(data) {
		var self = this;
		console.log(data);
		window.Server.user.put(
			{id:data.userId},
			{
				firstName: data.firstName,
				lastName: data.lastName,
				birthday: data.birthday,
				gender: data.gender
			}
		).then(function() {
			window.Server.addStudentToSchool.put({id:self.activeSchoolId,fk:data.userId},{
				nextOfKin:[{
					name:data.name,
					surname:data.surname,
					phone:data.phone,
					role:data.role
				}],
				medicalInfo:{
					injures:data.injures,
					allergy:data.allergy,
					other:data.other
				}
			}).then(function(){
				delete data.firstName;
				delete data.lastName;
				delete data.birthday;
				delete data.gender;
				delete data.injures;
				delete data.name;
				delete data.surname;
				delete data.phone;
				delete data.role;
				delete data.allergy;
				delete data.other;
				return window.Server.student.put(self.studentId, data);
			}).catch(function(er){
				alert(er.errorThrown+' Contact Server Support');
			})
		}).then(function() {
			self.isMounted() && (document.location.hash = 'school_admin/students');
		}).catch((e)=>{
			alert(e.errorThrown+' Please contact support');
			self.isMounted() && (document.location.hash = 'school_admin/students');
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<StudentForm title="Edit student" onFormSubmit={self.submitEdit} schoolId={self.activeSchoolId} binding={binding} />
		)
	}
});


module.exports = StudentEditPage;
