var LeanerAddForm = require('module/pages/leaner/add'),
	LeanerViewPage;

LeanerViewPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			schoolId = routingData.schoolId,
			learnerId = routingData.id,
			mode = routingData.mode;

		self.schoolId = schoolId;
		self.learnerId = learnerId;
		self.mode = mode || 'view';

		// Костыль, пока не будет ясности с путями хранения данных
		learnerId && window.Server.learner.get({
			schoolId: schoolId,
			learnerId: learnerId
		}).then(function (data) {
			binding.set('data', Immutable.fromJS(data));
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bTest">
				<LeanerAddForm mode={self.mode} learnerId={self.learnerId} schoolId={self.schoolId} binding={binding} />
			</div>
		)
	}
});


module.exports = LeanerViewPage;
