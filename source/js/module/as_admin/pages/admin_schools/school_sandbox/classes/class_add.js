const 	React = require('react'),
		ClassForm = require('module/as_admin/pages/admin_schools/school_sandbox/classes/class_form');

const ClassAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	self 			= this,
				globalBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId 	= globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		const self = this;
		window.Server.forms.post(self.activeSchoolId, data).then(function() {
			document.location.hash = 'school_sandbox/forms';
		}).catch(function(err){
			alert(err.errorThrown+' Server Error');
			document.location.hash = 'school_sandbox/forms';
		});
	},
	render: function() {
		const 	self 		= this,
				binding 	= self.getDefaultBinding();

		return (
			<ClassForm title="Add new form to school" onFormSubmit={self.submitAdd} binding={binding} />
		)
	}
});


module.exports = ClassAddPage;
