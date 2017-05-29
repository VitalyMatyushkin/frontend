/**
 * Created by wert on 19.11.15.
 */

const	sessionStorage	= window.sessionStorage,
		propz			= require('propz'),
		Cookies			= require('js-cookie');

let Helpers = {};

/** Helper to deal easier with localStorage
 * LocalStorage {
*  set(key, value);
*  get(key);
*  getSize();
*  remove(key);
*  clear();
* }
 **/
Helpers.LocalStorage = {
	set: function (key, value) {
		value = typeof value === 'string' ? String(value) : JSON.stringify(value);

		try {
			window.localStorage.setItem(key, value);
			return true;
		} catch (error_text) {
			console.error('Out of local store');
			return false;
		}
	},
	get: function (key) {
		const value = window.localStorage.getItem(key);

		if (value !== null) {
			return (value.indexOf('{') !== -1 || value.indexOf('[') !== -1 ? JSON.parse(value) : value);
		} else {
			return undefined;
		}
	},
	getSize: function () {
		return unescape(encodeURIComponent(JSON.stringify(window.localStorage))).length;
	},
	remove: function (key) {
		return window.localStorage.removeItem(key);
	},
	clear: function () {
		window.localStorage.clear();
	}
};

/** Helper to deal easier with sessionStorage
 * SessionStorage {
*  set(key, value);
*  get(key);
*  getSize();
*  remove(key);
*  clear();
* }
 **/
Helpers.SessionStorage = {
	set: function (key, value) {
		value = typeof value === 'string' ? String(value) : JSON.stringify(value);

		try {
			sessionStorage.setItem(key, value);
			return true;
		} catch (error_text) {
			console.error('Out of session store');
			return false;
		}
	},
	get: function (key) {
		const value = sessionStorage.getItem(key);

		if (value !== null) {
			return (value.indexOf('{') !== -1 || value.indexOf('[') !== -1 ? JSON.parse(value) : value);
		} else {
			return undefined;
		}
	},
	getSize: function () {
		return unescape(encodeURIComponent(JSON.stringify(sessionStorage))).length;
	},
	remove: function (key) {
		return sessionStorage.removeItem(key);
	},
	clear: function () {
		sessionStorage.clear();
	}
};


Helpers.cookie = {
	get: function (key) {
		let value = Cookies.get(key);

		if(typeof value !== 'undefined') {
			value = JSON.parse(value);
		}

		return value;
	},
	/**
	 * @param key
	 * @param value
	 * @param options - optional param, can contain expires and path
	 * @returns {boolean}
	 */
	set: function (key, value, options) {
		if(typeof options !== 'undefined') {
			Cookies.set(key, value, options);
		} else {
			Cookies.set(key, value);
		}

		return true;
	},
	remove: function (key) {
		return Cookies.remove(key);
	}
};

module.exports = Helpers;
