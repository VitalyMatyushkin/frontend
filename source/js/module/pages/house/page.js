var HouseAddForm = require('module/pages/house/form'),
	HouseView = require('module/pages/house/view'),
	HomeViewPage;

HomeViewPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			schoolId = routingData.schoolId,
			houseId = routingData.id,
			mode = routingData.mode;

		self.schoolId = schoolId;
		self.houseId = houseId;
		self.mode = mode || 'view';

		// Костыль, пока не будет ясности с путями хранения данных
		houseId && window.Server.house.get({
			schoolId: schoolId,
			houseId: houseId
		}).then(function (data) {
			var houseData = data;

			// Лютый костыль, пока не будет метода с полными данными
			Server.school.get(data.schoolId).then(function(schoolData) {
				houseData.schoolData = schoolData;

				binding.set('house', Immutable.fromJS(houseData));
			});
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			currentView = null;

		if (self.mode === 'edit' || self.mode === 'new') {
			currentView = <HouseAddForm mode={self.mode} houseId={self.houseId} schoolId={self.schoolId} binding={binding} />
		} else if (binding.sub('leaner')) {
			currentView = <HouseView binding={binding.sub('house')}  />;
		}

		return (
			<div className="bTest">
				{currentView}
			</div>
		)
	}
});


module.exports = HomeViewPage;
