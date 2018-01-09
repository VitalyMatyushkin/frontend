import * as log from 'loglevel';
import * as propz from 'propz';
import * as SessionHelper from 'module/helpers/session_helper';
import {AJAX} from 'module/core/AJAX';
import * as BPromise from 'bluebird';

const baseUrl = () => (window as any).apiBase;

type MethodType = 'GET' | 'PUT' | 'POST' | 'HEAD' | 'DELETE';

export class Service<DataType = any> {
	url:  string;
	binding: object;
	requiredParams: any[];

	constructor(url: string, binding: object) {
		this.url = url;
		this.binding = binding;

		/* Processing params from provided url. All unique params enclosed in curly brackets will be stored in array */
		const urlParams = Service.extractUrlParams(url);
		this.requiredParams = urlParams.length === 0 ? undefined : urlParams;
	}

	get(options?: object, data?: object): BPromise<DataType> {
		const preparedData = this.getPreparedDataForCallService(options, data);

		return this.callService('GET', preparedData.options, preparedData.data);
	}

	post(options?: object, data?: object): BPromise<DataType> {
		const preparedData = this.getPreparedDataForCallService(options, data);

		return this.callService('POST', preparedData.options, preparedData.data);
	}

	put(options?: object, data?: object): BPromise<DataType> {
		const preparedData = this.getPreparedDataForCallService(options, data);

		return this.callService('PUT', preparedData.options, preparedData.data);
	}

	delete(options?: object, data?: object): BPromise<DataType> {
		const preparedData = this.getPreparedDataForCallService(options, data);

		return this.callService('DELETE', preparedData.options, preparedData.data);
	}

	head(options?: object, data?: object): BPromise<DataType> {
		const preparedData = this.getPreparedDataForCallService(options, data);

		return this.callService('HEAD', preparedData.options, preparedData.data);
	}

	/**
	 * Assembles request from given params and performs it with jquery's $.ajax
	 * @param type HTTP verb
	 * @param requestParams
	 * @param data
	 * @returns {*}
	 * @private
	 */
	callService(type: MethodType, requestParams: object, data: object): BPromise<DataType> {
		// copy data because we will change it
		const dataCopy = { ...data };

		// get options
		const headers = Service.getHeaders(dataCopy);
		const isDataOnly = Service.getIsDataOnlyFlag(dataCopy);
		// and remove it from data
		// because in the end dataCopy should contain only data for post/put method
		// yep it's ugly design we should refactor it
		Service.removeOptions(dataCopy); // !! Modify args

		// TODO need refactoring
		// remove cases when we put filter to requestParams
		let filter = Service.getFilter([requestParams, dataCopy]);

		let url = this.url;


		const activeSession = typeof this.binding !== 'undefined' ?
			SessionHelper.getActiveSession(this.binding) :
			undefined;

		if (this.requiredParams) {
			url = url.replace(/\{(.*?)\}/g, function(match, param) {
				return requestParams[param];
			});
		}

		// TODO so strange
		const key ='filter';
		// Added condition to test for executions where there are no schoolId or other ids set for request
		// Tests for options being equal to null
		if (key) {
			filter = key +'=' + encodeURIComponent(JSON.stringify(filter));
			filter = url.indexOf('?') !== -1 ? '&' + filter : '?' + filter;
			if (typeof requestParams === 'object' && requestParams !== null) {
				delete requestParams[key];
			}

			if (typeof dataCopy === 'object') {
				delete dataCopy[key];
			}
		}

		return AJAX(
			{
				url:			baseUrl() + url + filter,
				type:			type,
				crossDomain:	true,
				data:			JSON.stringify(dataCopy),
				dataType:		'json',
				contentType:	'application/json',
				headers:		headers,
				beforeSend:		xhr => {
					if (activeSession && activeSession.id) {
						const headerName = activeSession.adminId ? "asid" : "usid";
						xhr.setRequestHeader(headerName, activeSession.id);
					}
					xhr.setRequestHeader('App-Signature', 'SquadInTouch-Web, 1.0.0');
				}
			},
			isDataOnly
		).then(response => {
			if(isDataOnly) {
				return response as DataType;
			} else {
				response.data =  response.data as DataType;

				return response;
			}
		});
	}

	getPreparedDataForCallService(options?: any, data?: object): { data?: object, options?: object} {
		const preparedData = {
			data:       undefined,
			options:    undefined
		};

		const isParamsRequired = typeof this.requiredParams !== 'undefined';

		switch (true) {
			case isParamsRequired && !options && !data: {
				this.showError();   // wtf? what to return here, Oleg?
				break;
			}
			case isParamsRequired && typeof options !== 'object' && this.requiredParams.length > 1: {
				// if options is not an object but we expecting multiple params.. error
				this.showError();
				break;
			}

            case isParamsRequired && typeof options !== 'object' && this.requiredParams.length <= 1: {
                preparedData.options = {};
                preparedData.options[ this.requiredParams[0] ] = options;
                preparedData.data = data;
                break;
            }

			case typeof this.requiredParams !== 'undefined'  && typeof options === 'object': {
				preparedData.options = options;
                preparedData.data = data;
				break;
			}
			default: {
				preparedData.data = data || options;
				preparedData.options = options;

				break;
			}
		}

		return preparedData;
	}

	showError() {
		log.error(`Service ${this.url} expects params: ${this.requiredParams}`);
	}

	/**
	 * Function returns headers object from agr data from function _callService
	 * @param data
	 */
	static getHeaders(data: object) {
		const headers = propz.get(data, ['options', 'headers'], undefined);

		return typeof headers !== 'undefined' ? headers : '';
	}

	/**
	 * Function returns isDataOnlyFlag flag from agr data from function _callService
	 * If isDataOnly is undefined then functions returns true by default
	 * @param data
	 */
	static getIsDataOnlyFlag(data: object) {
		const isDataOnly = propz.get(data, ['options', 'isDataOnly'], undefined);

		return typeof isDataOnly !== 'undefined' ? isDataOnly : true;
	}

	static removeOptions(data: any) {
		const options = propz.get(data, ['options'], undefined);

		if(typeof options !== 'undefined') {
			delete data.options;
		}
	}

	/**
	 * Function just checks sources for filter
	 * and returns first not undefined filter
	 * @param sources
	 * @returns {string}
	 */
	static getFilter(sources: object[]) {
		let filter = '';

		if(typeof sources !== 'undefined') {
			for(let i = 0; i < sources.length; i++) {
				const tempFilter = propz.get(sources, [i, 'filter'], undefined);

				if(typeof tempFilter !== 'undefined') {
					filter = Object.assign({}, tempFilter);
					break;
				}
			}
		}

		return filter;
	}

	/**
	 * Extracts params enclosed in curly braces from given string.
	 * Example:
	 * 		/users/{id}/friends/{friend_id}  -> [id, friend_id]
	 * 		/users -> []
	 * @param url string which contains params in curly braces like '/user/{id}'
	 * @returns {Array} array of extracted params
	 * @private
	 */
	static extractUrlParams(url: string) {
		const copyUrl = String(url);
		const urlParams = [];

		if (copyUrl.indexOf('{') !== -1) {
			// TODO WTF??
			copyUrl.replace(/\{(.*?)\}/g,(match, param) => {
					if(urlParams.indexOf(param) === -1) {
						urlParams.push(param);
					}

					return '';
				}
			);
		}

		return urlParams;
	}
}