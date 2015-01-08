var Menu,
	SVG = require('module/ui/svg');

Menu = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultProps: function () {
		return {
			items: [{
				href: '/search',
				icon: 'icon_search',
				name: 'Search',
				route: ''
			},{
				href: '/chat',
				icon: 'icon_bubbles',
				name: 'Chat',
				route: ''
			},{
				href: '/messages',
				icon: 'icon_envelope',
				name: 'Messages',
				route: ''
			},{
				href: '/articles',
				icon: 'icon_users',
				name: 'Teams',
				route: ''
			}]
		};
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			userDataBiding = binding.sub('userData'),
			MenuItemsViews = null;

		// Если пользователь авторизован, добавляем в отображение пункты меню
		if(userDataBiding.get('authorizationInfo')) {
			MenuItemsViews = self.props.items.map(function (item) {
				return (
					<a href={item.href} className="eTopMenu_item"><SVG icon={item.icon} />{item.name}</a>
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

