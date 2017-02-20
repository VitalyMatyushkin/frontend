// @flow
/**
 * Created by wert on 26.02.16.
 */

const Ajax = require('module/core/AJAX');


class ImageService {
	endpoint: string;
	__uploadUrl: string;

	constructor(endpoint: string) {
		this.endpoint   = endpoint;
		this.__uploadUrl  = endpoint + '/images';
	}

	/** Will upload file to storage and return it's url*/
	upload(file: any){		// TODO: file type ???
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
	}

	__getOriginalUrlByKey(key: string): string {
		return this.endpoint + '/images/' + key;
	}

	getResizedToHeightUrl(origUrl: string, height: number): string {
		return `${origUrl}?sizing=height&height=${height}`;
	}

	getResizedToBoxUrl(origUrl: string, height: number, width: number): string {
		return `${origUrl}?sizing=box&height=${height}&width=${width}`;
	}

	getResizedToMinValueUrl(origUrl: string, minValue: number): string {
		return `${origUrl}?sizing=minvalue&value=${minValue}`;
	}

}


module.exports = ImageService;