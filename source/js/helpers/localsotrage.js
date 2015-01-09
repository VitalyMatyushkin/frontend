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

})(window);