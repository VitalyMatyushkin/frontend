/**
 * Created by wert on 08.01.16.
 */

/* Few candys for working with JS arrays.
 * I choose not to pick any polyfill lib or core.js for adding few methods.
 */

/** ES6 Array.prototype.find implementation */
const findF = function(arr, predicate, that) {
    if('find' in Array) {   // there is Array.find() lets use it
        console.log("got it!");
        return arr.find(predicate, that);
    } else {
        const length = arr.length;
        let value;
        for (var i = 0; i < length; i++) {
            value = arr[i];
            if (predicate.call(that, value, i, arr)) {
                return value;
            }
        }
        return undefined;
    }
};

const ArrayHelpers = {
    find: findF
};




module.exports = ArrayHelpers;