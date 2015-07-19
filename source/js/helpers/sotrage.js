;
(function (space) {
	var Helpers = (space.Helpers = space.Helpers || {}),
		localStorage = space.localStorage;

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
			var value;

			if (value = localStorage.getItem(key)) {
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

			// Формирования списка полей к удалению
			for (var i = 0, ii = localStorage.length; i < ii; i++) {
				var field_name = localStorage.key(i);

				if (field_name && field_name.indexOf(name_substring) !== -1) {
					fields_to_remove.push(field_name);
				}
			}

			// Удаление ненужных полей
			for (var j = 0, jj = fields_to_remove.length; j < jj; j++) {
				self.remove(fields_to_remove[j]);
			}
		}
	};


	Helpers.cookie = {
		domain: document.location.hostname.match(/^(?:https?:\/\/)?(?:[A-z0-9-]+\.)?([^\/]+)/i)[1],
		pluses: /\+/g,
		expires: 99,
		_decode: function (decodeString) {
			return decodeURIComponent(decodeString.replace(this.pluses, ' '));
		},
		_updateCookies: function () {
			this.cookies = document.cookie.split('; ');
		},
		/*
		 * Запись Cookies
		 * */
		set: function (key, value, options) {
			var savePath = (options && options.path ? options.path : '/'),
				expires = (options && options.expires ? options.expires : this.expires),
				value = $.type(value) === 'string' ? String(value) : JSON.stringify(value),
				cookieString = '',
				dateExpire = new Date();

			dateExpire.setDate(dateExpire.getDate() + expires);


			cookieString += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '; path='+ savePath;

			// Установка времени жизни, если cookie не сессионная
			if (!(options && options.session === true)) {
				cookieString += ';domain=.' + this.domain + '; expires=' + (options && options.session === true ? 0 : dateExpire.toUTCString());
			}

			// Запись Cookies
			document.cookie = cookieString;

			this._updateCookies();

			return true;
		},
		/*
		 * Чтение из Cookies
		 * */
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
		/*
		 * Удаление записи
		 * */
		remove: function (key) {
			this.set(key, '', {
				expires: -10,
				session: false
			});
		}
	}

})(window);