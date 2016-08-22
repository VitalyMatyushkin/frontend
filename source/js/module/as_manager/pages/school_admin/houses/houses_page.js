const 	RouterView 			= require('module/core/router'),
		React 				= require('react'),
		Morearty			= require('morearty'),
		Route 				= require('module/core/route'),
		HousesListComponent 	= require("module/as_manager/pages/school_admin/houses/list/house-list"),
		HouseAddComponent 		= require("module/as_manager/pages/school_admin/houses/house_add"),
		HouseEditComponent 		= require("module/as_manager/pages/school_admin/houses/house_edit"),
		HouseStudentsComponent 	= require("module/as_manager/pages/school_admin/houses/house-students");

const HousesPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('housesRouting') } binding={globalBinding}>
				<Route path="/school_admin/houses"
					   binding={binding.sub('housesList')}
					   formBinding={binding.sub('housesForm')}
					   component={HousesListComponent}/>

				<Route path="/school_admin/houses/add"
					   binding={binding.sub('housesAdd')}
					   component={HouseAddComponent}/>

				<Route path="/school_admin/houses/edit"
					   binding={binding.sub('housesForm')}
					   component={HouseEditComponent}/>

				<Route path="/school_admin/houses/students"
					   binding={binding.sub('housesStudents')}
					   component={HouseStudentsComponent}/>
			</RouterView>
		)
	}
});

module.exports = HousesPage;
