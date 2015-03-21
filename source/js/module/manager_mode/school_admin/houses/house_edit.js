var HouseForm = require('module/manager_mode/school_admin/houses/house_form'),
	HouseEditPage;

HouseEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			houseId = routingData.id;

		binding.clear();

		if (houseId) {
			window.Server.house.get(houseId).then(function (data) {
				self.isMounted() && binding.set(Immutable.fromJS(data));
			});

			self.houseId = houseId;
		}
	},
	submitEdit: function(data) {
		var self = this;

		window.Server.house.put(self.houseId, data).then(function() {
			self.isMounted() && (document.location.hash = 'school_admin/houses');
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<HouseForm title="Edit house" onFormSubmit={self.submitEdit} binding={binding} />
		)
	}
});


module.exports = HouseEditPage;
