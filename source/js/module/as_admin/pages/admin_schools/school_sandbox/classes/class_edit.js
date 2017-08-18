const 	ClassForm 	= require('module/as_admin/pages/admin_schools/school_sandbox/classes/class_form'),
		React 		= require('react'),
		Morearty	= require('morearty'),
		Immutable 	= require('immutable');

const ClassEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				routingData = binding.toJS('routing.pathParameters'),
				schoolId 	= routingData[0],
				formId 		= routingData[1];

		binding.sub('formData').clear();

		if (formId && schoolId) {
			window.Server.schoolForm.get({
				schoolId: 	schoolId,
				formId: 	formId
			}).then( data => {
				binding.set('formData', Immutable.fromJS(data));
			});
		}
	},
	submitEdit: function(data) {
		const 	binding 	= this.getDefaultBinding(),
				routingData = binding.toJS('routing.pathParameters'),
				schoolId 	= routingData[0],
				formId 		= routingData[1];

		//Don't submit if the name field of the data is empty
		//Server will respond with failure causing button to stop at loading
		if(data.name !== ''){
			data.age = Number(data.age);
			window.Server.schoolForm.put({
				formId: 	formId,
				schoolId: 	schoolId
			}, data).then( () => {
				document.location.hash = `school_sandbox/${schoolId}/forms`;
			});
		}
	},
	render: function() {
		const 	binding = this.getDefaultBinding(),
				routingData = binding.toJS('routing.pathParameters'),
				schoolId 	= routingData[0];

		return (
				<ClassForm
					title 			= "Edit form"
					onFormSubmit 	= { this.submitEdit }
					binding 		= { binding }
					schoolId 		= {schoolId}
				/>
		)
	}
});


module.exports = ClassEditPage;
