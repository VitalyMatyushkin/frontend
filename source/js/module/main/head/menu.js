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
				href: '/#school',
				icon: 'icon_teams',
				name: 'School',
				route: '',
				key: 'School'
			},{
				href: '/#events',
				icon: 'icon_calendar',
				name: 'Events',
				route: '',
				key: 'Events',
				requiredData: 'userRules.activeSchoolId'
			}]
		};
	},
	render: function() {
		var self = this,
			globalBinding = self.getDefaultBinding(),
			currentPath = globalBinding.get('routing.currentPath'),
			authorization = globalBinding.get('userData.authorizationInfo.id'),
			MenuItemsViews = null;

		// Если пользователь авторизован, добавляем в отображение пункты меню
		if(authorization) {
			MenuItemsViews = self.props.items.map(function(item) {
				var itemPath = item.href.replace('#', ''),
					className = 'eTopMenu_item ' + (currentPath.indexOf(itemPath) !== -1 ? 'mActive' : '');

				if (item.requiredData && !globalBinding.get(item.requiredData)) {
					return null
				}

				return (
					<a href={item.href} key={item.key} className={className}><SVG icon={item.icon} />{item.name}</a>
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

