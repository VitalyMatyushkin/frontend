const 	HouseForm 	= require('module/as_admin/pages/admin_schools/school_sandbox/houses/house_form'),
		React 		= require('react'),
		Immutable 	= require('immutable');

const HouseEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				houseId 		= routingData.id;

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
			self.isMounted() && (document.location.hash = 'school_sandbox/houses');
		}).catch(function(er){
			alert(er.errorThrown+' Server Error');
			document.location.hash = 'school_sandbox/houses';
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
