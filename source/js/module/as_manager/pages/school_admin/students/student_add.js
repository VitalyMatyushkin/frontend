const 	StudentForm = require('module/as_manager/pages/school_admin/students/student_form'),
		Morearty	= require('morearty'),
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
	saveNextOfKin:function(student){
		const nok = [];

		nok.push({
			relationship:   '',
			firstName:      '',
			lastName:       '',
			phone:          '',
			email:          ''
		});

		for(let key in nok[0]){
			nok[0][key] = student['nok_'+key];
		}
		student.nextOfKin = nok;
	},

    submitAdd: function(data){
		this.saveNextOfKin(data);
        return window.Server.schoolStudents.post(this.activeSchoolId, data).then(() => {
            document.location.hash = 'school_admin/students';   // TODO: holly cow!
			document.location.reload();
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
