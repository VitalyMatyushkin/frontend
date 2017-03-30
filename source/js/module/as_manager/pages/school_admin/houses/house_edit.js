const 	HouseForm 	= require('module/as_manager/pages/school_admin/houses/house_form'),
		React 		= require('react'),
		Morearty	= require('morearty'),
		Immutable 	= require('immutable');


const HouseEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				activeSchoolId 	= globalBinding.get('userRules.activeSchoolId'),
				houseId 		= routingData.id;

		binding.clear();

		if (houseId) {
			window.Server.schoolHouse.get({schoolId:activeSchoolId, houseId:houseId}).then( data => {
				binding.set(Immutable.fromJS(data));
			});

			this.houseId = houseId;
		}
	},
	submitEdit: function(data) {
		const 	globalBinding 	= this.getMoreartyContext().getBinding(),
				activeSchoolId 	= globalBinding.get('userRules.activeSchoolId');

		window.Server.schoolHouse.put({schoolId:activeSchoolId, houseId:this.houseId}, data).then( () => {
			document.location.hash = 'school_admin/houses';
			
		});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<HouseForm title="Edit house" onFormSubmit={this.submitEdit} binding={binding} />
		)
	}
});


module.exports = HouseEditPage;
