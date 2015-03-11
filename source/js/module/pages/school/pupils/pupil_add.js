var PupilForm = require('module/pages/school/pupils/pupil_form'),
	PupilEditPage;

PupilEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		var self = this;

		window.Server.learners.post(self.activeSchoolId, data).then(function() {
			document.location.hash = 'school/pupils';
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<PupilForm title="Add new pupil..." onFormSubmit={self.submitAdd} schoolId={self.activeSchoolId} binding={binding} />
		)
	}
});


module.exports = PupilEditPage;
