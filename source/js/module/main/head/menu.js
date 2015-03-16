var Menu,
	SVG = require('module/ui/svg');

// TODO: привести компоненты Menu и SubMenu к одному виду
Menu = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultProps: function () {
		return {
			items: [/*{
				href: '/#search',
				icon: 'icon_search',
				name: 'Search',
				key: 'Search'
			},*/{
				href: '/#school/summary',
				icon: 'icon_teams',
				name: 'School',
				key: 'School',
				routes: ['/school/:subPage', '/school/:subPage/:mode', '/schools/add', '/schools']
			},{
				href: '/#events/calendar',
				icon: 'icon_calendar',
				name: 'Events',
				key: 'Events',
                routes: ['/events/:subPage'],
				requiredData: 'userRules.activeSchoolId'
			},
            {
                href: '/#invites',
                icon: 'icon_shot',
                name: 'Invites',
                key: 'Invites',
                routes: ['/invites', '/invites/:filter', '/invites/:inviteId/:mode'],
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
					itemRoutes = item.routes || [],
					className = 'eTopMenu_item ';

				if (currentPath && (currentPath.indexOf(itemPath) !== -1 || itemRoutes.indexOf(currentPath) !== -1)) {
					className += 'mActive';
				}

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

