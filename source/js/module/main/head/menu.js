var Menu,
	SVG = require('module/ui/svg');

Menu = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultProps: function () {
		return {
			items: [{
				href: '/#search',
				icon: 'icon_search',
				name: 'Search',
				route: '',
				key: 'Search'
			},{
				href: '/#teams',
				icon: 'icon_teams',
				name: 'Teams',
				route: '',
				key: 'Teams'
			},{
				href: '/#events',
				icon: 'icon_calendar',
				name: 'Events',
				route: '',
				key: 'Events'
			},{
				href: '/#players',
				icon: 'icon_user',
				name: 'Players',
				route: '',
				key: 'Players'
			}]
		};
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			authBinding = binding.sub('userData.authorizationInfo'),
			authData = authBinding.toJS(),
			MenuItemsViews = null;

		// Если пользователь авторизован, добавляем в отображение пункты меню
		if(authData && authData.id) {
			MenuItemsViews = self.props.items.map(function (item) {
				return (
					<a href={item.href} key={item.key} className="eTopMenu_item"><SVG icon={item.icon} />{item.name}</a>
				);
			});
		}

		return (
			<div className="bTopMenu">
				{MenuItemsViews}
			</div>
		)
	}
});

module.exports = Menu;

