/**
 * Created by wert on 26.02.16.
 */

const Ajax = require('module/core/AJAX');

/**
 * Simple wrapper for image service usage
 * @constructor
 */
const ImageService = function(endpoint){
    this.endpoint   = endpoint;
    this.__uploadUrl  = endpoint + '/images';
};

/** Will upload file to storage and return it's url*/
ImageService.prototype.upload = function(file){
    const fd = new FormData();
    fd.append('image', file);
    return Ajax({
        type:           'POST',
        url:            this.__uploadUrl,
        data:           fd,
        processData:    false,
        contentType:    false
    })
    .then( success => this.__getOriginalUrlByKey(success.data.key));
};

ImageService.prototype.__getOriginalUrlByKey = function(key){
    return this.endpoint + '/images/' + key;
};

ImageService.prototype.getResizedToHeightUrl = function(origUrl, height) {
    return `${origUrl}?sizing=height&height=${height}`;
};

ImageService.prototype.getResizedToBoxUrl = function(origUrl, height, width) {
    return `${origUrl}?sizing=box&height=${height}&width=${width}`;
};



module.exports = ImageService;