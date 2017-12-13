const 	RouterView 				= require('module/core/router'),
		React 					= require('react'),
		Morearty				= require('morearty'),
		Route 					= require('module/core/route'),
		HousesListComponent 	= require("module/as_manager/pages/school_admin/houses/list/house-list"),
		HouseAddComponent 		= require("module/as_manager/pages/school_admin/houses/house_add"),
		HouseEditComponent 		= require("module/as_manager/pages/school_admin/houses/house_edit"),
		HouseStudentsComponent 	= require("module/as_manager/pages/school_admin/houses/house-students");

const HousesPage = React.createClass({
	mixins: [Morearty.Mixin],
	//The function, which will call when user click on <Row> with Houses in Grid
	handleClickHouse: function(houseId, houseName) {
		document.location.hash = 'school_admin/houses/students?id=' + houseId + '&name=' + houseName;
	},
	//The function, which will call when user click on <Row> with list of student in Grid
	handleClickStudent: function(studentId) {
		document.location.hash = 'school_admin/students/stats?id=' + studentId;
	},
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('housesRouting') } binding={globalBinding}>
				<Route
					path			= "/school_admin/houses"
					binding			= { binding.sub('housesList') }
					formBinding		= { binding.sub('housesForm') }
					component		= { HousesListComponent }
					handleClick		= { this.handleClickHouse }
				/>

				<Route
					path			= "/school_admin/houses/add"
					binding			= { binding.sub('houseAdd') }
					component		= { HouseAddComponent }
				/>

				<Route
					path			= "/school_admin/houses/edit"
					binding			= { binding.sub('houseEdit') }
					component		= { HouseEditComponent }
				/>

				<Route
					path			= "/school_admin/houses/students"
					binding			= { binding.sub('housesStudents') }
					component		= { HouseStudentsComponent }
					handleClick		= { this.handleClickStudent }
				/>
			</RouterView>
		)
	}
});

module.exports = HousesPage;
