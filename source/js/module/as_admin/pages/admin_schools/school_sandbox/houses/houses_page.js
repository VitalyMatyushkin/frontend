const	RouterView 			= require('module/core/router'),
		React 				= require('react'),
		Morearty			= require('morearty'),
		Route	 			= require('module/core/route'),
		HouseListComponent 	= require('module/as_admin/pages/admin_schools/school_sandbox/houses/house-list'),
		HouseAddComponent 	= require('module/as_admin/pages/admin_schools/school_sandbox/houses/house_add'),
		HouseEditComponent 	= require('module/as_admin/pages/admin_schools/school_sandbox/houses/house_edit'),
		{SVG}				= require('module/ui/svg');


const HousesPage = React.createClass({
	mixins: [Morearty.Mixin],
	createNewHouse: function(){
		document.location.hash = document.location.hash +'/add';
	},
	render: function() {
		const binding     	= this.getDefaultBinding(),
				subBinding  	= binding.sub('housesRouting'),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				addButton = <div className="addButtonShort" onClick={this.createNewHouse}><SVG icon="icon_add_house" /></div>;

		return (
			<RouterView routes={ subBinding.sub('routing') } binding={globalBinding}>
				<Route path="/school_sandbox/:schoolId/houses" binding={subBinding.sub('housesList')} component={HouseListComponent} addButton={addButton} />
				<Route path="/school_sandbox/:schoolId/houses/add"  binding={subBinding} component={HouseAddComponent}  />
				<Route path="/school_sandbox/:schoolId/houses/edit/:houseId" binding={subBinding} component={HouseEditComponent}  />
			</RouterView>
		)
	}
});


module.exports = HousesPage;
