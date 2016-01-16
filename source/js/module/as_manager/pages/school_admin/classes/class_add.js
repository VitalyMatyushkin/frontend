var ClassForm = require('module/as_manager/pages/school_admin/classes/class_form'),
	React = require('react'),
	ClassAddPage;

ClassAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		var self = this;

		data.schoolId = self.activeSchoolId;

		self.activeSchoolId && window.Server.forms.post(self.activeSchoolId, data).then(function() {
			document.location.hash = 'school_admin/forms';
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<ClassForm title="Add new form..." onFormSubmit={self.submitAdd} binding={binding} />
		)
	}
});


module.exports = ClassAddPage;
