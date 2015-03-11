var PupilForm = require('module/pages/school/pupils/pupil_form'),
	PupilEditPage;

PupilEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId'),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			learnerId = routingData.id;

		binding.clear('data');

		if (activeSchoolId && learnerId) {
			window.Server.learner.get({
				schoolId: activeSchoolId,
				learnerId: learnerId
			}).then(function (data) {
				self.isMounted() && binding.set('data', Immutable.fromJS(data));
			});

			self.activeSchoolId = activeSchoolId;
			self.learnerId = learnerId;
		}
	},
	submitEdit: function(data) {
		var self = this;

		window.Server.learner.put({
			learnerId: self.learnerId,
			schoolId: self.activeSchoolId
		}, data).then(function() {
			self.isMounted() && (document.location.hash = 'school/pupils');
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
