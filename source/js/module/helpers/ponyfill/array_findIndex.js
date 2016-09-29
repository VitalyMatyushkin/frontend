/**
 * Created by Anatoly on 27.09.2016.
 */

/**
 * This is Array.prototype.findIndex implementation taken from here: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
 * but did so with the help of Object.defineProperty()
 * Will be used in case when native Array.prototype.findIndex unavailable
 * */
const setMethodArrayFindIndex = function() {
	if (!Array.prototype.findIndex) {
		Object.defineProperty(Array.prototype, "findIndex", {
			value: function(predicate) {
				'use strict';
				if (this == null) {
					throw new TypeError('Array.prototype.findIndex called on null or undefined');
				}
				if (typeof predicate !== 'function') {
					throw new TypeError('predicate must be a function');
				}
				var list = Object(this);
				var length = list.length >>> 0;
				var thisArg = arguments[1];
				var value;

				for (var i = 0; i < length; i++) {
					value = list[i];
					if (predicate.call(thisArg, value, i, list)) {
						return i;
					}
				}
				return -1;
			}
		});
	}
};

module.exports = setMethodArrayFindIndex;