const 	React 			= require('react'),
		Morearty		= require('morearty'),
		SchoolHelper 	= require('module/helpers/school_helper'),
		ClassForm 		= require('./class_form');

const ClassAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	submitAdd: function(data) {
		const schoolId = SchoolHelper.getActiveSchoolId(this);
		data.schoolId = schoolId;
		data.age = Number(data.age);

		window.Server.schoolForms.post(schoolId, data).then( () => {
			document.location.hash = 'school_admin/forms';
		});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<ClassForm
				title 			= "Add new form..."
				onFormSubmit 	= { this.submitAdd }
				binding 		= { binding }
			/>
		)
	}
});


module.exports = ClassAddPage;
