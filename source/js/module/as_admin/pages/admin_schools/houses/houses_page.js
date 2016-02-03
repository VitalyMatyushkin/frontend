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
				<Route path="/admin_schools/admin_views/houses" binding={binding.sub('housesList')} formBinding={binding.sub('housesForm')} component="module/as_admin/pages/admin_schools/houses/houses_list"  />
				<Route path="/admin_schools/admin_views/houses/add"  binding={binding.sub('housesAdd')} component="module/as_admin/pages/admin_schools/houses/house_add"  />
				<Route path="/admin_schools/admin_views/houses/edit" binding={binding.sub('housesForm')} component="module/as_admin/pages/admin_schools/houses/house_edit"  />
			</RouterView>
		)
	}
});


module.exports = HousesPage;
