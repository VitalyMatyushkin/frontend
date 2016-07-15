const 	React 			= require('react'),
		Morearty		= require('morearty'),
		ClassForm 		= require('./class_form');

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

		data.schoolId = self.activeSchoolId;

		self.activeSchoolId && window.Server.schoolForms.post(self.activeSchoolId, data).then(function() {
			document.location.hash = 'school_admin/forms';
		});
	},
	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<ClassForm title="Add new form..." onFormSubmit={self.submitAdd} binding={binding} />
		)
	}
});


module.exports = ClassAddPage;
