const 	React 			= 	require('react'),
		ClassForm 		= 	require('module/as_admin/pages/admin_schools/school_sandbox/classes/class_form');

const ClassAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
        const   self        = this,
                binding 	= self.getDefaultBinding(),
                schoolId    = binding.get('routing.pathParameters.0');
        
		self.schoolId = schoolId;
        self.FORM_URL = `school_sandbox/${schoolId}/forms`;
	},
	submitAdd: function(data) {
		const self = this;
		window.Server.forms.post(self.schoolId, data).then(function() {
			document.location.hash = self.FORM_URL;
		}).catch(function(err){
			document.location.hash = self.FORM_URL;
		});
	},
	render: function() {
		const 	self 		= this,
				binding 	= self.getDefaultBinding();

		return (
			<ClassForm title="Add new form to school" onFormSubmit={self.submitAdd} binding={binding.sub('formAdd')} />
		)
	}
});


module.exports = ClassAddPage;
