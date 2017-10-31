const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable');

const	RouterView			= require('module/core/router'),
		Route				= require('module/core/route');

const	AppsListComponent	= require('module/as_admin/pages/apps/app_list'),
		AppsAddComponent	= require('module/as_admin/pages/apps/app_add'),
		AppsEditComponent	= require('module/as_admin/pages/apps/app_edit');


const SportsPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			appList: {},
			appAdd: {
				appForm: {}
			},
			appEdit: {
				appForm: {}
			},
			appRouting: {}
		});
	},
	render: function() {
		const	self = this,
				binding = self.getDefaultBinding(),
				globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={binding.sub('appRouting')} binding={globalBinding}>
				<Route
					path		= "/apps"
					binding		= { binding.sub('appList') }
					component	= { AppsListComponent }
				/>
				<Route
					path		= "/apps/add"
					binding		= { binding.sub('appAdd') }
					component	= { AppsAddComponent }
				/>
				<Route
					path		= "/apps/edit"
					binding		= { binding.sub('appEdit') }
					component	= { AppsEditComponent }
				/>
			</RouterView>
		)
	}
});

module.exports = SportsPage;
