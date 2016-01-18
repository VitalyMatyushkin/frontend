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

		binding.clear();

		if (activeSchoolId && studentId) {
			window.Server.student.get(studentId).then(function (data) {
				window.Server.user.get(data.userId).then(function (userdata) {
					//TODO use filter include
					data.firstName = userdata.firstName;
					data.lastName = userdata.lastName;
					data.birthday = userdata.birthday;
					data.gender = userdata.gender;
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

		window.Server.user.put(
			data.userId,
			{
				firstName: data.firstName,
				lastName: data.lastName,
				birthday: data.birthday,
				gender: data.gender
			}
		).then(function() {
			delete data.firstName;
			delete data.lastName;
			delete data.birthday;
			delete data.gender;
			return window.Server.student.put(self.studentId, data);
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
