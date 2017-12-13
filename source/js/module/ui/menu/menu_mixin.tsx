// @flow

import * as React    		from 'react';
import {GoBackItem}    		from './sub_menu_items/go_back_item';
import {ChooseFileItem}  	from './sub_menu_items/choose_file_item';
import {DefaultItem}    	from './sub_menu_items/default_item';
import * as SessionHelper   from 'module/helpers/session_helper';
import {HelpItem }   		from './sub_menu_items/help_item';

export const MenuMixin = {
	getDefaultProps: function () {
		return {
			items: []
		};
	},
	
	__getMenuNode(item: any, globalBinding: any, authorization: boolean, currentPath: string, itemClassName: string): any {
		const itemPath = item.href && item.href.replace('#', ''),
			itemRoutes = item.routes || [];
		
		let className = item.disabled ? itemClassName + 'mDisabled' : itemClassName;

		// check permission
		if ((item.requiredData && !globalBinding.get(item.requiredData) || (item.authorization && !authorization))) {
			return null;
		}

		// set the highlighting
		if ((currentPath && (currentPath.indexOf(itemPath) !== -1 || itemRoutes.indexOf(currentPath) !== -1)) ||
			'/' + document.location.hash == item.href) {
			className += 'mActive';
		}

		// render
		const userId = SessionHelper.getSessionId(
			globalBinding.sub('userData')
		);

		switch (item.key) {
			case 'goback':
				return <GoBackItem key={'goback' + item.name} name={item.name} icon={item.icon}
								   className={item.className} num={item.num} className2={className}/>;
			case 'file':
				return <ChooseFileItem key={'file' + item.name} name={item.name} className={className}
									   onChange={item.onChange}/>;
			case 'Help':
				return <HelpItem key={item.name} userId={userId} name={item.name} className={className}/>;
			case 'Console':
				//We don't want to show the console tab if the current user is not an admin
				//if(userRole == 'admin')
				if (userId !== undefined)
					return <DefaultItem key={'console'} name={item.name} href={item.href} className={item.className}
										className2={className} num={item.num} icon={item.icon}/>;
				return null;
			default:
				return <DefaultItem key={item.name} name={item.name} href={item.href} className={item.className}
									className2={className} num={item.num} icon={item.icon}/>;
		}
	},

	getMenuNodes(): any {
		const globalBinding = this.getMoreartyContext().getBinding(),
			binding = this.getDefaultBinding(),
			itemsBinding = this.getBinding('itemsBinding'),
			authorization = SessionHelper.getSessionId(
				globalBinding.sub('userData')
			),
			currentPath = binding.get('currentPath') || '/';

		let menuItems;

		if (itemsBinding && itemsBinding.toJS()) {
			menuItems = itemsBinding.toJS();
		} else {
			menuItems = this.props.items;
		}

		if (typeof menuItems.map === 'function') {
			//rendering menu
			const MenuItemsViews = menuItems.map(item => this.__getMenuNode(item, globalBinding, authorization, currentPath, this.itemClassName));
			return MenuItemsViews;
		} else {
			return null;
		}
	}
};