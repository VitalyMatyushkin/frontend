/**
 * Created by wert on 26.02.16.
 */


import  {AxiosAjax} from "module/core/ajax/axios-ajax";
import {IAjax} from "module/core/ajax/ajax";
import * as BPromise from 'bluebird';


export class ImageService {
	readonly endpoint: string;
	readonly ajax: IAjax;
	private readonly uploadUrl: string;


	constructor(endpoint: string, ajax: IAjax = new AxiosAjax()) {
		this.endpoint   = endpoint;
		this.uploadUrl  = endpoint + '/images';
		this.ajax		= ajax;
	}

	/** Will upload file to storage and return it's url*/
	upload(file: any): BPromise<string> {		// TODO: file type ???
		const fd = new FormData();
		fd.append('image', file);
		return this.ajax.request({
			method:			'post',
			url:			this.uploadUrl,
			data:           fd
		})
			.then( success => this.__getOriginalUrlByKey(success.data.key));
	}

	private __getOriginalUrlByKey(key) {
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

}