const 	SVG 		= require('module/ui/svg'),
		React 		= require('react');

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
		return 	<span onClick={function(){window.history.back();}} key={item.key} className={className}>
                	{this.__itemIcon(item)} {item.name} {item.num || ''}
				</span>;
	},
	/** function to render file menu node (for selecting file from computer) */
	__renderFileNode: function(item, className){
		return (
			<span key={item.key} className={className}>
				{item.name}
				<input onChange={item.onChange} type='file' />
			</span>
		);
	},
	/** function to render default menu node */
	__renderDefaultNode: function(item, className) {
		return (
			<a href={item.href} key={item.key} className={className}>
				{this.__itemIcon(item)} {item.name} {item.num || ''}
			</a>
		);
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
		const userRole 	= globalBinding.get('currentUserRole');
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
