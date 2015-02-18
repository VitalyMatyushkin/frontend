var HouseAddForm = require('module/pages/house/form'),
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
			binding.set('data', Immutable.fromJS(data));
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bTest">
				<HouseAddForm mode={self.mode} houseId={self.houseId} schoolId={self.schoolId} binding={binding} />
			</div>
		)
	}
});


module.exports = HomeViewPage;
