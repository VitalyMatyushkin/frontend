var ClassForm = require('module/pages/school/classes/class_form'),
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

		self.activeSchoolId && window.Server.forms.post(data).then(function() {
			document.location.hash = 'school/classes';
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<ClassForm title="Add new class..." onFormSubmit={self.submitAdd} binding={binding} />
		)
	}
});


module.exports = ClassAddPage;
