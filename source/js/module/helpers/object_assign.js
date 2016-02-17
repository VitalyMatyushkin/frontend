/**
 * Created by wert on 17.02.16.
 */

/** I choose not to use polyfill in favor or small and controllable patches applied in certain places */


/** This is canonical Object.assign implementation taken from here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 *  Will be used in case when native Object.assign unavailable
 * @param target
 * @returns {*}
 */
const localImpl = function (target) {
    'use strict';
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
            for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                }
            }
        }
    }
    return output;
};

/** Selecting implementation to use */
const object_assign = typeof Object.assign != 'function' ? localImpl : Object.assign;


module.exports = object_assign;