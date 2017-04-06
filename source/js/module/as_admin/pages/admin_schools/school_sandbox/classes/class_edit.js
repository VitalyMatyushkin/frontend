const 	ClassForm 	= require('module/as_admin/pages/admin_schools/school_sandbox/classes/class_form'),
		React 		= require('react'),
		Morearty	= require('morearty'),
		Immutable 	= require('immutable');

const ClassEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
        const   self        = this,
                binding 	= self.getDefaultBinding(),
                routingData = binding.toJS('routing.pathParameters'),
                schoolId    = routingData[0],
                formId      = routingData[1];

		binding.sub('formEdit').clear();

		if (formId) {
			window.Server.schoolForm.get({formId:formId, schoolId:schoolId}).then(function (data) {
				binding.set('formEdit', Immutable.fromJS(data));
			});
		}
	},
	submitEdit: function(data) {
		const   self        = this,
                binding 	= self.getDefaultBinding(),
                routingData = binding.toJS('routing.pathParameters'),
                schoolId    = routingData[0],
                formId      = routingData[1];

        //Don't submit if the name field of the data is empty
		//Server will respond with failure causing button to stop at loading
		if(data.name !=''){
			data.name = data.name;

			window.Server.schoolForm.put({formId:formId, schoolId:schoolId}, data).then(function() {
				document.location.hash = `school_sandbox/${schoolId}/forms`;
			});
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
				<ClassForm title="Edit form" onFormSubmit={self.submitEdit} binding={binding.sub('formEdit')} />
		)
	}
});


module.exports = ClassEditPage;
