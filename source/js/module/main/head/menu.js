var Menu,
	SVG = require('module/ui/svg');

Menu = React.createClass({
	mixins: [Morearty.Mixin],
	/*componentWillMount: function() {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		// Если есть идентефикатор активной школы
		if (activeSchoolId) {
			self._redirectToSchoolId(activeSchoolId);
		} else {

			self._updateSchoolList().then(function(schoolsList) {

				// Если есть хотя бы одна школа, делаем первую школой "по умолчанию"
				if (schoolsList[0]) {
					globalBinding.set('userRules.activeSchoolId', schoolsList[0].id);
					self._redirectToSchoolId(schoolsList[0].id);
				} else {
					// В противном случае перенаправляем пользователя на страницу добавления школы
					self._redirectToAddSchool();
				}
			});

		};

	},*/
	getDefaultProps: function () {
		return {
			items: [{
				href: '/#search',
				icon: 'icon_search',
				name: 'Search',
				route: '',
				key: 'Search'
			},{
				href: '/#schools',
				icon: 'icon_teams',
				name: 'Schools',
				route: '',
				key: 'Schools'
			},{
				href: '/#events',
				icon: 'icon_calendar',
				name: 'Events',
				route: '',
				key: 'Events'
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

