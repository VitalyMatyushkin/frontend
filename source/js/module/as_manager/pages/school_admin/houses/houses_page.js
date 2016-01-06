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
				<Route path="/school_admin/houses" binding={binding.sub('housesList')} formBinding={binding.sub('housesForm')} component="module/as_manager/pages/school_admin/houses/houses_list"  />
				<Route path="/school_admin/houses/add"  binding={binding.sub('housesAdd')} component="module/as_manager/pages/school_admin/houses/house_add"  />
				<Route path="/school_admin/houses/edit" binding={binding.sub('housesForm')} component="module/as_manager/pages/school_admin/houses/house_edit"  />
			</RouterView>
		)
	}
});


module.exports = HousesPage;
