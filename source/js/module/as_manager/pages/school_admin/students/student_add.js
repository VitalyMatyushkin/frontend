var StudentForm = require('module/as_manager/pages/school_admin/students/student_form'),
	StudentEditPage;

StudentEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		var self = this;

		data.schoolId = self.activeSchoolId;

		//TODO So sick...
		data.schoolId && window.Server.users.post({
			firstName: data.firstName,
			lastName: data.lastName,
			gender: data.gender,
			birthday: data.birthday,
			email: "fake" + Math.floor(Date.now() / 1000) + "@mail.ru",
			password: "password"
		}).then(function(userData) {
			window.Server.Permissions.post(
				{
					preset: 'student',
					principalId: userData.id,
					schoolId: data.schoolId,
					formId: data.formId,
					houseId: data.houseId
				}
			).then(function(permissionData) {
					window.Server.setPermissions.post({id:permissionData.id},{accepted:true}).then(function() {
						document.location.hash = 'school_admin/students';
					})
				});
		})
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<StudentForm title="Add new student..." onFormSubmit={self.submitAdd} schoolId={self.activeSchoolId} binding={binding} />
		)
	}
});


module.exports = StudentEditPage;
