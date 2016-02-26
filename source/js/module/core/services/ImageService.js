/**
 * Created by wert on 26.02.16.
 */

const Ajax = require('module/core/AJAX');

/**
 *
 * @constructor
 */
const ImageService = function(endpoint){
    this.endpoint   = endpoint;
    this.__uploadUrl  = endpoint + '/images';
};


ImageService.prototype.upload = function(file){
    console.log('file.type is: ' + file.type);
    const fd = new FormData();
    fd.append('image', file);
    return Ajax({
        type:   'POST',
        url:    this.__uploadUrl,
        data:   fd,
        processData: false,
        contentType: false
    });
};

ImageService.prototype.getOriginalUrl = function(){};

ImageService.prototype.getResizedToHeightUrl = function(){};


module.exports = ImageService;