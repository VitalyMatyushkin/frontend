const 	React 			= 	require('react'),
		ClassForm 		= 	require('module/as_admin/pages/admin_schools/school_sandbox/classes/class_form'),
		MoreartyHelper	=	require('module/helpers/morearty_helper');
		

const ClassAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	FORM_URL:'school_sandbox/forms',
	componentWillMount: function () {
		const 	self 			= 	this;
		self.activeSchoolId 	= 	MoreartyHelper.getActiveSchoolId(self);
	},
	submitAdd: function(data) {
		const self = this;
		window.Server.forms.post(self.activeSchoolId, data).then(function() {
			document.location.hash = self.FORM_URL;
		}).catch(function(err){
			document.location.hash = self.FORM_URL;
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