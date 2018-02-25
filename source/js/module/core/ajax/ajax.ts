import * as BPromise from "bluebird";
import {FlatObject} from 'module/core/flat_object';

export interface IAjax {
	request(requestData: AjaxRequest): BPromise<AjaxResponse>
}

export interface AjaxResponse {
	data:		any
	status:		number
	headers:	FlatObject
	request:	XMLHttpRequest
}


export interface AjaxRequest {
	url:		string
	method:		'get' | 'post' | 'put' | 'delete' | 'head'
	headers?:	FlatObject,
	urlParams?:	FlatObject,
	data?:		string | object | File | Blob | FormData
}

export class CancelError extends Error {
	constructor(...args) {
		super(...args);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, CancelError);
		} else {
			this.stack = (new Error()).stack;
		}

	}
}
