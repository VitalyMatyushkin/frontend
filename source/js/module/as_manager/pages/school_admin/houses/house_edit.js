const 	HouseForm = require('module/as_manager/pages/school_admin/houses/house_form'),
		React = require('react'),
		Immutable = require('immutable');


const HouseEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routingData = globalBinding.sub('routing.parameters').toJS(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId'),
			houseId = routingData.id;

		binding.clear();

		if (houseId) {
			window.Server.schoolHouse.get({schoolId:activeSchoolId, houseId:houseId}).then(function (data) {
				self.isMounted() && binding.set(Immutable.fromJS(data));
			});

			self.houseId = houseId;
		}
	},
	submitEdit: function(data) {
        var self = this,
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		window.Server.schoolHouse.put({schoolId:activeSchoolId, houseId:self.houseId}, data).then(function() {
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
