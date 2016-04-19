const 	StudentForm = require('module/as_manager/pages/school_admin/students/student_form'),
		React 		= require('react');

/** Page to add new student to school */
const StudentAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	self 			= this,
				globalBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId 	= globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
	},
    
    submitAdd: function(data){
        data.birthday = data.birthday.substr(0, data.birthday.indexOf('T'));    // TODO: hack
        return window.Server.students.post(this.activeSchoolId, data).then(() => {
            document.location.hash = 'school_admin/students';   // TODO: holly cow!
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


module.exports = StudentAddPage;
