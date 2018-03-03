/**
 * Created by wert on 26.02.16.
 */

const {AJAX} = require('module/core/AJAX');

class ImageService {
	constructor(endpoint) {
		this.endpoint   = endpoint;
		this.__uploadUrl  = endpoint + '/images';
	}

	/** Will upload file to storage and return it's url*/
	upload(file){		// TODO: file type ???
		const fd = new FormData();
		fd.append('image', file);
		return AJAX({
			type:           'POST',
			url:            this.__uploadUrl,
			data:           fd,
			processData:    false,
			contentType:    false
		})
			.then( success => this.__getOriginalUrlByKey(success.data.key));
	}

	__getOriginalUrlByKey(key) {
		return this.endpoint + '/images/' + key;
	}

	getResizedToHeightUrl(origUrl, height) {
		return `${origUrl}?sizing=height&height=${height}`;
	}

	getResizedToBoxUrl(origUrl, height, width) {
		return `${origUrl}?sizing=box&height=${height}&width=${width}`;
	}

	getResizedToMinValueUrl(origUrl, minValue){
		return `${origUrl}?sizing=minvalue&value=${minValue}`;
	}

	getOriginalUrlByImgServerUrl(url){
		return AJAX({
			type: "GET",
			url: url
		})
	}

}


module.exports = ImageService;