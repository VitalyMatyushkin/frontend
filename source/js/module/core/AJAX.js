/**
 * Created by wert on 08.12.15.
 */

var $ = require('jquery');
var Promise = require('bluebird');

/**
 * Does $.ajax({...}) and return result as Promise
 * Accepts all $.ajax() parameters except `error` and `success` handlers. Error and success are available with
 *  Promise semantics.
 * @returns {Promise}
 */
function ajax(configDetails) {
    return new Promise(function (resolve, reject, onCancel) {
        configDetails.error = function(data){
          reject(data);
        };
        configDetails.success = function(data){
            resolve(data);
        };
        var request = $.ajax(configDetails);

        onCancel(function () {
            request.abort();
        });
    });
}


module.exports = ajax;