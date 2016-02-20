const 	StudentForm = require('module/as_manager/pages/school_admin/students/student_form'),
		React 		= require('react');

const StudentEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	self 			= this,
				globalBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId 	= globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		const self = this;
		data.schoolId = self.activeSchoolId;
		//TODO So sick...
		data.schoolId && window.Server.users.post({
			firstName: 	data.firstName,
			lastName: 	data.lastName,
			gender: 	data.gender,
			birthday: 	data.birthday
		}).then(function(userData) {
            return window.Server.Permissions.post(
                {
                    preset: 		'student',
                    principalId: 	userData.id,
                    schoolId: 		data.schoolId,
                    formId: 		data.formId,
                    houseId: 		data.houseId
                });
        }).then(function(permissionData) {
            return window.Server.setPermissions.post({id: permissionData.id}, {accepted: true});
        }).then(permission =>{
            if(permission && permission.student) {
                return window.Server.student.put(permission.student.id, {
                    nextOfKin: [{
                        name: data.name
                    }],
                    medicalInfo: {
                        allergy: data.allergy
                    }
                });
            }
        }).then(() => {
            document.location.hash = 'school_admin/students';
        }).catch(function(err){
            console.log(err);
            alert(err.errorThrown+' Contact Server support');
            self.isMounted() && (document.location.hash = 'school_admin/students');
        });
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
