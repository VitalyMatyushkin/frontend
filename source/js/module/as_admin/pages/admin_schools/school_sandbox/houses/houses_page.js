
const	RouterView 	= require('module/core/router'),
		React 		= require('react'),
		Morearty	= require('morearty'),
		Route	 	= require('module/core/route');

const HousesPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self        	= this,
				binding     	= self.getDefaultBinding(),
				subBinding  	= binding.sub('housesRouting'),
				globalBinding 	= self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ subBinding.sub('routing') } binding={globalBinding}>
				<Route path="/school_sandbox/:schoolId/houses" binding={subBinding.sub('housesList')} component="module/as_admin/pages/admin_schools/school_sandbox/houses/houses_list"  />
				<Route path="/school_sandbox/:schoolId/houses/add"  binding={subBinding} component="module/as_admin/pages/admin_schools/school_sandbox/houses/house_add"  />
				<Route path="/school_sandbox/:schoolId/houses/edit/:houseId" binding={subBinding} component="module/as_admin/pages/admin_schools/school_sandbox/houses/house_edit"  />
			</RouterView>
		)
	}
});


module.exports = HousesPage;
