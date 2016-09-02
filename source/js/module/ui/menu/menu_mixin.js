const 	SVG 		= require('module/ui/svg'),
		React 		= require('react'),
		GoBackItem		= require('./sub_menu_items/go_back_item'),
		ChooseFileItem 	= require('./sub_menu_items/choose_file_item'),
		DefaultItem		= require('./sub_menu_items/default_item');

const MenuMixin = {
	propTypes: {
		items: React.PropTypes.array
	},
	getDefaultProps: function () {
		return {
			items: []
		};
	},
	__itemIcon: function(item){
		return item.icon ? <SVG classes={item.className} icon={item.icon} /> : null;
	},
	/** function to render goback menu node */
	__renderGoBackNode: function(item, className){
		return <GoBackItem
			name={item.name}
			icon={item.icon}
			className={item.className}
			num={item.num}
			className2={className}
		/>;
	},
	/** function to render file menu node (for selecting file from computer) */
	__renderFileNode: function(item, className){
		return <ChooseFileItem name={item.name} className={className} onChange={item.onChange}/>;
	},
	/** function to render default menu node */
	__renderDefaultNode: function(item, className) {
		return <DefaultItem name={item.name} href={item.href} className={item.className} className2={className} num={item.num} icon={item.icon}/>;
	},
	__getMenuNode: function(item, globalBinding, authorization, currentPath, itemClassName) {
		const 	itemPath 	= item.href && item.href.replace('#', ''),
				itemRoutes 	= item.routes || [];

		let 	className 	= itemClassName;

		className += item.disabled ? 'mDisabled' : '';

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
				return this.__renderGoBackNode(item, className);
			case 'file':
				return this.__renderFileNode(item, className);
			case 'Console':
				//We don't want to show the console tab if the current user is not an admin
				//if(userRole == 'admin')
				if(userId !== undefined)
						return this.__renderDefaultNode(item, className);
				return null;
			default:
				return this.__renderDefaultNode(item, className);
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
