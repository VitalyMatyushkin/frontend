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
			itemsBinding = self.getBinding('itemsBinding'),
			authorization = globalBinding.get('userData.authorizationInfo.id'),
			currentPath = binding.get('currentPath') || '/',
			menuItems = self.props.items;
		if (itemsBinding && itemsBinding.toJS()) {
			menuItems = itemsBinding.toJS();
		}

		//rendering menu
		var MenuItemsViews = menuItems.map(function(item) {
			var itemPath = item.href && item.href.replace('#', ''),
				itemRoutes = item.routes || [],
				className = self.itemClassName,
				SvgIcon = item.icon ? <SVG icon={item.icon} /> : null,
				itemNum = item.num || '',
				resultNode;

			className += item.disabled ? 'mDisabled' : '';

			// check permission
			if ((item.requiredData && !globalBinding.get(item.requiredData) || (item.authorization && !authorization))) {
				return null
			}

			// set the highlighting
			if ((currentPath && (currentPath.indexOf(itemPath) !== -1 || itemRoutes.indexOf(currentPath) !== -1)) ||
					'/'	+ document.location.hash == item.href)
			{
				className += 'mActive';
			}

			// render
			if (item.key === 'goback') {
				resultNode =
                    <span onClick={function(){window.history.back();}} key={item.key} className={className}>
                        {SvgIcon} {item.name} {itemNum}
                    </span>;
			} else if (item.key === 'file') {
				resultNode =
                    <span key={item.key} className={className}>
                        {item.name}
                        <input onChange={item.onChange} type='file' />
                    </span>;
			} else {
				resultNode =
                    <a href={item.href} key={item.key} className={className}>
                        {SvgIcon} {item.name} {itemNum}
                    </a>;
			}
			//We don't want to show the console tab if the current user is not an admin
			if(globalBinding.get('currentUserRole')!=='admin' && item.key ==='Console'){
				if(globalBinding.get('userData.authorizationInfo.userId') !== undefined){
					return resultNode;
				}else{return null;}
			}else{
				return resultNode;
			}
		});

		return MenuItemsViews;
	}
};

module.exports = MenuMixin;
