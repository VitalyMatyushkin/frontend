const 	React 		= require('react'),
		Morearty 	= require('morearty'),
		Immutable 	= require('immutable'),
		SchoolHelper 	= require('module/helpers/school_helper'),
		ClassForm 	= require('module/as_manager/pages/school_admin/classes/class_form');

const ClassEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				activeSchoolId 	= SchoolHelper.getActiveSchoolId(this),
				formId 			= routingData.id;
		
		binding.sub('formData').clear();
		
		if (formId) {
			window.Server.schoolForm.get({
				schoolId: 	activeSchoolId,
				formId: 	formId
			}).then( data => {
				binding.set('formData', Immutable.fromJS(data));
			});
		}
	},
	submitEdit: function(data) {
		const 	activeSchoolId 	= SchoolHelper.getActiveSchoolId(this),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				formId 			= routingData.id;
		
		data.age = Number(data.age);
		//Don't submit if the name field of the data is empty
		//Server will respond with failure causing button to stop at loading
		if(data.name !== ''){
			window.Server.schoolForm.put({
				schoolId: 	activeSchoolId,
				formId: 	formId
			}, data).then( () => {
				document.location.hash = 'school_admin/forms';
			});
		}
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
				<ClassForm
					title 			= "Edit form"
					onFormSubmit 	= { this.submitEdit }
					binding 		= { binding }
				/>
		)
	}
});


module.exports = ClassEditPage;
