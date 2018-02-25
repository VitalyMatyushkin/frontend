/**
 * Created by Anatoly on 25.10.2016.
 */

import {DataPrototype} from "module/data/data_prototype";

const Storage				= require('module/helpers/storage');

const	popupStorageName 	= 'isCookiePopupDisplaying',
		popupBindingName 	= 'isCookiePopupDisplaying',
		expiresDays 		= 1;

export class CookiePopup extends DataPrototype {
	/**
	 * Obtaining initial data state cookiePopup
	 * by default we showing popup with cookie policy on each visit
	 * because we don't store this value anywhere in user's browser
	 */
	getDefaultState(){
		const data = Storage.cookie.get(popupStorageName);

		// Restoration of the information about the cookiePopup
		return data !== 'false'; 	// default - true
	};

	/**
	 * Binding to data change cookiePopup
	 */
	initBind() {
		const bindObject = this.bindObject;

		// Automatically save data when changing values
		bindObject.addListener(popupBindingName, () => {
			const data = bindObject.get(popupBindingName);

			Storage.cookie.set(popupStorageName, data, {expires: expiresDays});
		});
	};
}

export const CookiePopupData = new CookiePopup();