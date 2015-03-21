var PupilForm = require('module/as_manager/pages/school_admin/pupils/pupil_form'),
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

		data.schoolId = self.activeSchoolId;

		data.schoolId && window.Server.students.post(data).then(function() {
			document.location.hash = 'school_admin/pupils';
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
