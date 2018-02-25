/**
 * Created by Anatoly on 25.10.2016.
 */
const 	DataPrototype 		= require('module/data/data_prototype'),
		Storage				= require('module/helpers/storage'),
		cookiePopupData 	= Object.create(DataPrototype),
		popupStorageName 	= 'isCookiePopupDisplaying',
		popupBindingName 	= 'isCookiePopupDisplaying',
		expiresDays 		= 1;

/**
 * Obtaining initial data state cookiePopup
 * by default we showing popup with cookie policy on each visit
 * because we don't store this value anywhere in user's browser
 */
cookiePopupData.getDefaultState = function(){
	const data = Storage.cookie.get(popupStorageName);

	// Restoration of the information about the cookiePopup
	return data !== 'false'; 	// default - true
};

/**
 * Binding to data change cookiePopup
 */
cookiePopupData.initBind = function() {
	var self = this,
		bindObject = self.bindObject;

	// Automatically save data when changing values
	bindObject.addListener(popupBindingName, function() {
		var data = bindObject.get(popupBindingName);

		Storage.cookie.set(popupStorageName, data, {expires: expiresDays});
	});
};

module.exports = cookiePopupData;