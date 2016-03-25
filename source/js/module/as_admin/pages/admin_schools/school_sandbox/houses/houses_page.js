var HousesPage,
	RouterView = require('module/core/router'),
	React = require('react'),
	Route = require('module/core/route');

HousesPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('housesRouting') } binding={globalBinding}>
				<Route path="/school_sandbox/houses" binding={binding.sub('housesList')} formBinding={binding.sub('housesForm')} component="module/as_admin/pages/admin_schools/houses/houses_list"  />
				<Route path="/school_sandbox/houses/add"  binding={binding.sub('housesAdd')} component="module/as_admin/pages/admin_schools/school_sandbox/houses/house_add"  />
				<Route path="/school_sandbox/houses/edit" binding={binding.sub('housesForm')} component="module/as_admin/pages/admin_schools/school_sandbox/houses/house_edit"  />
			</RouterView>
		)
	}
});


module.exports = HousesPage;
