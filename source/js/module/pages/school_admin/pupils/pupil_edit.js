var PupilForm = require('module/pages/school_admin/pupils/pupil_form'),
	PupilEditPage;

PupilEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId'),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			studentId = routingData.id;

		binding.clear();

		if (activeSchoolId && studentId) {
			window.Server.student.get(studentId).then(function (data) {
				self.isMounted() && binding.set(Immutable.fromJS(data));
			});

			self.activeSchoolId = activeSchoolId;
			self.studentId = studentId;
		}
	},
	submitEdit: function(data) {
		var self = this;

		window.Server.student.put(self.studentId, data).then(function() {
			self.isMounted() && (document.location.hash = 'school_admin/pupils');
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<PupilForm title="Edit pupil" onFormSubmit={self.submitEdit} schoolId={self.activeSchoolId} binding={binding} />
		)
	}
});


module.exports = PupilEditPage;
