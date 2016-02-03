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
					data.allergy = data.medicalInfo!==undefined?data.medicalInfo.allergy:'';
					self.isMounted() && binding.set(Immutable.fromJS(data));
					return userdata;
				}).catch((err)=>{alert(err.errorThrown+' server error occurred fetching user data')});
				return data;
			}).catch((err)=>{
				alert(err.errorThrown+' server error occurred while getting student data');
			});

			self.activeSchoolId = activeSchoolId;
			self.studentId = studentId;
		}
	},
	submitEdit: function(data) {
		var self = this;
		window.Server.users.put(
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
					name:data.name
				}],
				medicalInfo:{
					allergy:data.allergy
				}
			}).then(function(){
				delete data.firstName;
				delete data.lastName;
				delete data.birthday;
				delete data.gender;
				delete data.name;
				delete data.allergy;
				return window.Server.student.put(self.studentId, data);
			}).catch(function(er){
				alert(er.errorThrown+' Contact Server Support');
			})
		}).then(function() {
			self.isMounted() && (document.location.hash = 'school_admin/students');
		}).catch((e)=>{
			alert(e.errorThrown+' Please contact server support');
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
