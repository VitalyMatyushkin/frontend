/**
 * Created by wert on 19.11.15.
 */

var $ = require('jquery');

var Helpers = {};
var localStorage = window.localStorage;

/** Helper to deal easier with localStorage
 * LocalStorage {
*  set(key, value);
*  get(key);
*  getSize();
*  remove(key);
*  clear();
*  cleanSubstringContains(subkey);
* }
**/
Helpers.LocalStorage = {
    set: function (key, value) {
        value = $.type(value) === 'string' ? String(value) : JSON.stringify(value);

        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error_text) {
            console.error('Out of local store');
            return false;
        }
    },
    get: function (key) {
        const value = localStorage.getItem(key);

        if (value !== null) {
            return (value.indexOf('{') !== -1 || value.indexOf('[') !== -1 ? JSON.parse(value) : value);
        } else {
            return undefined;
        }
    },
    getSize: function () {
        return unescape(encodeURIComponent(JSON.stringify(localStorage))).length;
    },
    remove: function (key) {
        return localStorage.removeItem(key);
    },
    clear: function () {
        localStorage.clear();
    },
    cleanSubstringContains: function (name_substring) {
        var self = this,
            fields_to_remove = [];

        // Filling fields_to_remove array
        for (var i = 0, ii = localStorage.length; i < ii; i++) {
            var field_name = localStorage.key(i);

            if (field_name && field_name.indexOf(name_substring) !== -1) {
                fields_to_remove.push(field_name);
            }
        }

        // Deleting entries from localStorage
        for (var j = 0, jj = fields_to_remove.length; j < jj; j++) {
            self.remove(fields_to_remove[j]);
        }
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
        var savePath = (options && options.path ? options.path : '/'),
            expires = (options && options.expires ? options.expires : this.expires),
            value = $.type(value) === 'string' ? String(value) : JSON.stringify(value),
            cookieString = '',
            dateExpire = new Date();

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
