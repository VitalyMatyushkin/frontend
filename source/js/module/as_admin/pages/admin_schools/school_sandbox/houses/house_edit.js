const 	HouseForm 	= require('module/as_admin/pages/admin_schools/school_sandbox/houses/house_form'),
		React 		= require('react'),
		Immutable 	= require('immutable');

const HouseEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
                routingData = binding.toJS('routing.pathParameters'),
                schoolId    = routingData[0],
                houseId     = routingData[1];

		binding.sub('houseEdit').clear();

		if (houseId) {
			window.Server.schoolHouse.get({houseId:houseId, schoolId:schoolId}).then(function (data) {
				binding.set('houseEdit', Immutable.fromJS(data));
			});
		}
	},
	submitEdit: function(data) {
        const 	self 		= this,
            binding 	= self.getDefaultBinding(),
            routingData = binding.toJS('routing.pathParameters'),
            schoolId    = routingData[0],
            houseId     = routingData[1],
            url         = `school_sandbox/${schoolId}/houses`;

		window.Server.schoolHouse.put({houseId:houseId, schoolId:schoolId}, data).then(function() {
			document.location.hash = url;
		}).catch(function(er){
			console.error(er.errorThrown+' Server Error');
			document.location.hash = url;
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<HouseForm title="Edit house" onFormSubmit={self.submitEdit} binding={binding.sub('houseEdit')} />
		)
	}
});


module.exports = HouseEditPage;
