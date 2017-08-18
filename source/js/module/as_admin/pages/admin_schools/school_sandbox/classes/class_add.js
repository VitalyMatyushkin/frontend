const 	React 			= 	require('react'),
		Morearty 		= require('morearty'),
		ClassForm 		= 	require('module/as_admin/pages/admin_schools/school_sandbox/classes/class_form');

const ClassAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				schoolId 	= binding.get('routing.pathParameters.0');
		
		this.schoolId = schoolId;
		this.FORM_URL = `school_sandbox/${schoolId}/forms`;
	},
	submitAdd: function(data) {
		data.age = Number(data.age);
		window.Server.schoolForms.post(this.schoolId, data).then( () => {
			document.location.hash = this.FORM_URL;
		}).catch( (err) => {
			document.location.hash = this.FORM_URL;
		});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<ClassForm
				title 			= "Add new form to school"
				schoolId 		= { this.schoolId }
				onFormSubmit 	= { this.submitAdd }
				binding 		= { binding.sub('formAdd') }
			/>
		)
	}
});


module.exports = ClassAddPage;
