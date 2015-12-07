/**
 * Created by Bright on 04/12/2015.
 */
'use strict';
var uploadService = function(url){
    var fileServiceCore;
    fileServiceCore = {
        ajax: function (method, url, args) {
            //Create a promise - normal promise instead of self written one
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: url + '/upload',
                    type: method,
                    success: function (res) {
                        var uploadedFile = res.result.files.file[0];
                        resolve(uploadedFile);
                    },
                    error: function (xhr) {
                        reject(xhr.statusText);
                    },
                    data: args,
                    cache: false,
                    contentType: false,
                    processData: false
                });
            });
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