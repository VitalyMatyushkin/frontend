import axios, {AxiosInstance} from 'axios';
import * as BPromise from 'bluebird';
import {IAjax, AjaxResponse, AjaxRequest, CancelError} from "module/core/ajax/ajax";


/**
 * Cancellation.
 * I'm not sure how to deal correctly with promise cancellation.
 * There are two ways:
 * 1. cancel silently as bluebird does. Check details here: http://bluebirdjs.com/docs/api/cancellation.html
 * 2. propagate error through rejection handler with CancelError
 *
 * I'm not sure which way is more correct and more useful. So this part will be updated a bit later
 */



export interface AjaxConfig {
	timeout?: number
	baseUrl?: string
}


export class AxiosAjax implements IAjax {

	private axiosInstance: AxiosInstance;

	constructor(config?: AjaxConfig) {
		this.axiosInstance = axios.create();
	}

    request(requestData: AjaxRequest): BPromise<AjaxResponse> {
		return new BPromise<AjaxResponse>((resolve, reject, onCancel) => {
			const cancelTokenSource = axios.CancelToken.source();
			const result = this.axiosInstance.request({
				url:			requestData.url,
				method:			requestData.method,
				headers:		requestData.headers,
				params:			requestData.urlParams,
				data:			requestData.data,
				cancelToken:	cancelTokenSource.token
			});

			onCancel(() => {
				console.log('on cancel triggered');
				cancelTokenSource.cancel('Canceled via bluebird promise API');
			});

			result.then( axiosResponse => {
				resolve({
					data:		axiosResponse.data,
					status:		axiosResponse.status,
					headers:	axiosResponse.headers,
					request:	axiosResponse.request as XMLHttpRequest
				});
			}, err =>  {
				const isCancelled = axios.isCancel(err);
				if(isCancelled) {
					reject(new CancelError());
				} else {
					reject(err);
				}

			})

		});
	}
}