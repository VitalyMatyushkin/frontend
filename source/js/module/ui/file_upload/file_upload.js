/**
 * Created by Bright on 04/12/2015.
 */
let {AJAX} = require('module/core/AJAX');

'use strict';
var uploadService = function(url){
    var fileServiceCore;
    fileServiceCore = {
        ajax: function (method, url, args) {
            return AJAX({
                url: url + '/upload',
                type: method,
                data: args,
                cache: false,
                contentType: false,
                processData: false
            }).then(
                result => result.data.result.files.file[0] ,
                xhr => xhr.statusText
            );
        }
    };
    //Return module methods as in Adapter Pattern
    //It has more methods than needed now but could be used in the future
    return {
        'get' : function(args) {
            return fileServiceCore.ajax('GET', url, args);
        },
        'post' : function(args) {
            return fileServiceCore.ajax('POST', url, args);
        },
        'put' : function(args) {
            return fileServiceCore.ajax('PUT', url, args);
        },
        'delete' : function(args) {
            return fileServiceCore.ajax('DELETE', url, args);
        }
    };
};

module.exports = uploadService;