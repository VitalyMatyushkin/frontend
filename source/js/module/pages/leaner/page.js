var LeanerAddForm = require('module/pages/leaner/form'),
	LeanerView = require('module/pages/leaner/view'),
	LeanerPage;

LeanerPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			schoolId = routingData.schoolId,
			learnerId = routingData.id,
			mode = routingData.mode,
			leanerData = {};

		self.schoolId = schoolId;
		self.learnerId = learnerId;
		self.mode = mode || 'view';

		// Костыль, пока не будет ясности с путями хранения данных
		learnerId && window.Server.learner.get({
			schoolId: schoolId,
			learnerId: learnerId
		}).then(function (data) {
			leanerData = data;

			// Лютый костыль, пока не будет метода с полными данными
			Server.class.get(data.classId).then(function(classData) {
				leanerData.classData = classData;

				Server.house.get(data.houseId).then(function(houseData) {
					leanerData.houseData = houseData;

					Server.school.get(data.schoolId).then(function(schoolData) {
						leanerData.schoolData = schoolData;

						binding.set('leaner', Immutable.fromJS(leanerData));
					});
				});

			});

		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			currentView = null;

		if (self.mode === 'edit' || self.mode === 'new') {
			currentView = <LeanerAddForm mode={self.mode} learnerId={self.learnerId} schoolId={self.schoolId} binding={binding} />
		} else if (binding.sub('leaner')) {
			currentView = <LeanerView binding={binding.sub('leaner')}  />;
		}

		return (
			<div className="bTest">
				{currentView}
			</div>
		)
	}
});


module.exports = LeanerPage;
