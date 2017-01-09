/**
 * Created by wert on 19.11.15.
 */

const 	sessionSstorage 	= window.sessionStorage;

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
    domain: document.location.hostname.match(/^(?:https?:\/\/)?(?:[A-z0-9-]+\.)?([^\/]+)/i)[1],
    pluses: /\+/g,	// TODO: WTF ????????
    expires: 99,	// TODO: why 99 days ????
    _decode: function (decodeString) {
        return decodeURIComponent(decodeString.replace(this.pluses, ' '));
    },
    _updateCookies: function () {
        this.cookies = document.cookie.split('; ');
    },
    /**
     * Setting Cookies
     * @param key to set
     * @param value to assign
     * @param options few options to adjust while setting cookie. Optional.
     * @param options.path path for saving cookie. Optional.
     * @param options.expires cookie expiration date. Optional.
     * @param options.session boolean which defines is cookie session based. Optional.
     **/
    set: function (key, value, options) {
        const   savePath    = (options && options.path ? options.path : '/'),
                expires     = (options && options.expires ? options.expires : this.expires),
                dateExpire  = new Date();

        let cookieString = '';

        value = typeof value === 'string' ? String(value) : JSON.stringify(value),

        dateExpire.setDate(dateExpire.getDate() + expires);
        cookieString += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '; path=' + savePath;

        // Setting lifetime in case of cookie is not session-based
        if (!(options && options.session === true)) {
            cookieString += ';domain=.' + this.domain + '; expires=' + (options && options.session === true ? 0 : dateExpire.toUTCString());
        }

        // setting cookie
        document.cookie = cookieString;

        this._updateCookies();

        return true;
    },
    /**
     * Getting Cookies
     */
    get: function (key) {
        var currentParts,
            currentCookie;

        this._updateCookies();

        for (var i = 0, l = this.cookies.length; i < l; i++) {
            currentParts = this.cookies[i].split('=');
            if (this._decode(currentParts.shift()) === key) {
                currentCookie = this._decode(currentParts.join('='));
                return (currentCookie.indexOf('{') !== -1 || currentCookie.indexOf('[') !== -1 ? JSON.parse(currentCookie) : currentCookie);
            }
        }

        return undefined;
    },
    /**
     * Removing given key from cookies
     */
    remove: function (key) {
        return this.set(key, '', {
            expires: -10,
            session: false
        });
    }
};

module.exports = Helpers;
