const 	RouterView 	= require('module/core/router'),
		Route 		= require('module/core/route'),
		SubMenu 	= require('module/ui/menu/sub_menu'),
		React 		= require('react');

const OpponentsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this;

		// Пункты подменю
		self.menuItems = [{
			href: '/#opponents/map',
			name: 'Map',
			key: 'opponents_map'
		},{
			href: '/#opponents/list',
			name: 'List',
			key: 'opponents_list'
		}];
	},

	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<div className="bOpponentsPage">
				<SubMenu binding={binding.sub('opponentRouting')} items={self.menuItems} />

				<RouterView routes={ binding.sub('opponentRouting') } binding={globalBinding}>
					<Route path="/opponents/map" binding={binding} component="module/as_school/pages/opponents/map/map_page"  />
					<Route path="/opponents/list" binding={binding} component="module/as_school/pages/opponents/list/list_page"  />
				</RouterView>

			</div>
		)
	}
});


module.exports = OpponentsPage;
