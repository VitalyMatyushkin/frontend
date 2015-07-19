var SVG = require('module/ui/svg'),
	MenuMixin = {
	propTypes: {
		items: React.PropTypes.array
	},
	getDefaultProps: function () {
		return {
			items: []
		};
	},
	getMenuNodes: function() {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			binding = self.getDefaultBinding(),
			itemBinding = self.getBinding('itemsBinding'),
			currentPath = binding.get('currentPath') || '/',
			authorization = globalBinding.get('userData.authorizationInfo.id'),
			authorizationInfo = globalBinding.toJS('userData.authorizationInfo'),
			menuItems = self.props.items,
			MenuItemsViews = null;


		if (itemBinding && itemBinding.toJS()) {
			menuItems = itemBinding.toJS();
		}

		MenuItemsViews = menuItems.map(function(item) {
			var itemPath = item.href && item.href.replace('#', ''),
				itemRoutes = item.routes || [],
				className = self.itemClassName,
				SvgIcon = item.icon ? <SVG icon={item.icon} /> : null,
				resultNode;

			if ((currentPath && (currentPath.indexOf(itemPath) !== -1 || itemRoutes.indexOf(currentPath) !== -1)) || '/' + document.location.hash == item.href) {
				className += 'mActive';
			}

			if ((item.requiredData && !globalBinding.get(item.requiredData) || (item.authorization && !authorization))) {
				return null
			}

			//if (item.verified && item.authorization) {
			//	console.log(globalBinding.get('userData.authorizationInfo'));
			//}

			if (item.key === 'goback') {
				resultNode = <span onClick={function(){window.history.back();}} key={item.key} className={className}>{SvgIcon} {item.name}</span>;
			} else {
				resultNode = <a href={item.href} key={item.key} className={className}>{SvgIcon} {item.name}</a>;
			}

			return resultNode;
		});

		return MenuItemsViews;
	}
};

module.exports = MenuMixin;
