const 	React 		= require('react'),
		GoBackItem		= require('./sub_menu_items/go_back_item'),
		ChooseFileItem 	= require('./sub_menu_items/choose_file_item'),
		DefaultItem		= require('./sub_menu_items/default_item'),
		HelpItem		= require('./sub_menu_items/help_item');

const MenuMixin = {
	propTypes: {
		items: React.PropTypes.array
	},
	getDefaultProps: function () {
		return {
			items: []
		};
	},
	__getMenuNode: function(item, globalBinding, authorization, currentPath, itemClassName) {
		const 	itemPath 	= item.href && item.href.replace('#', ''),
				itemRoutes 	= item.routes || [];

		let className 	= item.disabled ? itemClassName + 'mDisabled' : itemClassName;

		// check permission
		if ((item.requiredData && !globalBinding.get(item.requiredData) || (item.authorization && !authorization))) {
			return null;
		}

		// set the highlighting
		if ((currentPath && (currentPath.indexOf(itemPath) !== -1 || itemRoutes.indexOf(currentPath) !== -1)) ||
			'/'	+ document.location.hash == item.href)
		{
			className += 'mActive';
		}

		// render
		const userId 	= globalBinding.get('userData.authorizationInfo.userId');

		switch (item.key) {
			case 'goback':
				return <GoBackItem key={'goback' + item.name} name={item.name} icon={item.icon} className={item.className} num={item.num} className2={className}/>;
			case 'file':
				return <ChooseFileItem key={'file' + item.name} name={item.name} className={className} onChange={item.onChange}/>;
			case 'Help':
				return <HelpItem userId={userId} name={item.name} className={className}/>;
			case 'Console':
				//We don't want to show the console tab if the current user is not an admin
				//if(userRole == 'admin')
				if(userId !== undefined)
						return <DefaultItem key={'console'} name={item.name} href={item.href} className={item.className} className2={className} num={item.num} icon={item.icon}/>;
				return null;
			default:
				return <DefaultItem key={item.name} name={item.name} href={item.href} className={item.className} className2={className} num={item.num} icon={item.icon}/>;
		}
	},

	getMenuNodes: function() {
		const 	self 			= this,
				globalBinding 	= self.getMoreartyContext().getBinding(),
				binding 		= self.getDefaultBinding(),
				itemsBinding 	= self.getBinding('itemsBinding'),
				authorization 	= globalBinding.get('userData.authorizationInfo.id'),
				currentPath 	= binding.get('currentPath') || '/';

		let menuItems;

		if (itemsBinding && itemsBinding.toJS()) {
			menuItems = itemsBinding.toJS();
		} else {
			menuItems = self.props.items;
		}

		//rendering menu
		const MenuItemsViews = menuItems.map(item => self.__getMenuNode(item, globalBinding, authorization, currentPath, self.itemClassName));
		return MenuItemsViews;
	}
};

module.exports = MenuMixin;
