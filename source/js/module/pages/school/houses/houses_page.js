var HousesPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route');

HousesPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('housesRouting') } binding={globalBinding}>
				<Route path="/school/houses" binding={binding.sub('housesList')} formBinding={binding.sub('housesForm')} component="module/pages/school/houses/houses_list"  />
				<Route path="/school/houses/add"  binding={binding.sub('housesAdd')} component="module/pages/school/houses/house_add"  />
				<Route path="/school/houses/edit" binding={binding.sub('housesForm')} component="module/pages/school/houses/house_edit"  />
			</RouterView>
		)
	}
});


module.exports = HousesPage;
