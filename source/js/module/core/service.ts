import * as log from 'loglevel';
import * as propz from 'propz';
import * as SessionHelper from 'module/helpers/session_helper';
import * as BPromise from 'bluebird';
import {urlParameterParser} from "module/core/service/url_parameter_parser";
import {FlatObject} from "module/core/flat_object";
import {IAjax} from "module/core/ajax/ajax";
import {AxiosAjax} from "module/core/ajax/axios-ajax";

const baseUrl = () => (window as any).apiBase;

type MethodType = 'get' | 'put' | 'post' | 'head' | 'delete';

interface ActiveSession {
	id?: string,
	role?: string,
	userId?: string,
	adminId?: string
	expireAt?: string
	verified?: {
		personal: boolean
		email: boolean
		sms: boolean
	}
}

interface Data {
	options?: {
		headers?: FlatObject
		isDataOnly?: boolean
	}
	[key: string]: any
}


export class Service<GetDataType = any, PostDataType = any, DeleteDataType = any> {
	readonly url:  string;
	readonly binding: any;
	readonly ajax: IAjax;
	readonly requiredParams: string[];


	constructor(url: string, binding?: object, ajax?: IAjax) {
		this.url = url;
		this.binding = binding;
		this.ajax = typeof ajax === 'undefined' ? new AxiosAjax() : ajax;

		/* Processing params from provided url. All unique params enclosed in curly brackets will be stored in array */
		this.requiredParams = urlParameterParser(url);
	}

	/**
	 *
	 * @param {object} options is either value of the only param if url is parametrized, or object with params, or data if there is no params
	 * @param {object} data
	 * @return {Bluebird<GetDataType>}
	 */
	get(options?: object, data?: Data): BPromise<GetDataType> {
		const preparedData = this.getPreparedDataForCallService(options, data);

		return this.callService('get', preparedData.options, preparedData.data) as BPromise<GetDataType>;
	}

	post(options?: object, data?: Data): BPromise<PostDataType> {
		const preparedData = this.getPreparedDataForCallService(options, data);

		return this.callService('post', preparedData.options, preparedData.data) as BPromise<PostDataType>;
	}

	put(options?: object, data?: Data): BPromise<PostDataType> {
		const preparedData = this.getPreparedDataForCallService(options, data);

		return this.callService('put', preparedData.options, preparedData.data) as BPromise<PostDataType>;
	}

	delete(options?: object, data?: Data): BPromise<DeleteDataType> {
		const preparedData = this.getPreparedDataForCallService(options, data);

		return this.callService('delete', preparedData.options, preparedData.data) as BPromise<DeleteDataType>;
	}

	head(options?: object, data?: Data): BPromise<GetDataType> {
		const preparedData = this.getPreparedDataForCallService(options, data);

		return this.callService('head', preparedData.options, preparedData.data) as BPromise<GetDataType>;
	}

	/**
	 * Assembles request from given params and performs it with jquery's $.ajax
	 * @param type HTTP verb
	 * @param requestParams
	 * @param data
	 * @returns {*}
	 * @private
	 */
	private callService(type: MethodType, requestParams: object, data?: Data): BPromise<GetDataType | PostDataType | DeleteDataType> {
		// copy data because we will change it
		const dataCopy = { ...data };

		// get options
		const	headers: FlatObject	= Service.getHeaders(dataCopy),
				isDataOnly: boolean	= Service.getIsDataOnlyFlag(dataCopy);

		delete dataCopy['options'];

		let url = this.url;

		if (this.requiredParams.length > 0) {
			url = url.replace(/\{(.*?)\}/g, (match, param) => requestParams[param]);
		}

		const activeSession	= this.getActiveSession();

		// remove cases when we put filter to requestParams
		const	jsonFilter		= Service.getFilter([requestParams, dataCopy]);

		const filterKey ='filter';

		let strFilterToAppend = '';

		if(jsonFilter) {
			const strFilter = filterKey +'=' + encodeURIComponent(JSON.stringify(jsonFilter));
			strFilterToAppend = url.indexOf('?') !== -1 ? '&' + strFilter : '?' + strFilter;
		}

		if (typeof requestParams === 'object' && requestParams !== null) {
			delete requestParams[filterKey];
		}

		if (typeof dataCopy === 'object') {
			delete dataCopy[filterKey];
		}

		const finalHeaders = {
			...headers,
			'App-Signature': 'SquadInTouch-Web, 1.0.0'
		};

		if (activeSession && activeSession.id) {
			const headerName = activeSession.adminId ? "asid" : "usid";
			finalHeaders[headerName] = activeSession.id;
		}

		return this.ajax.request({
			url:			baseUrl() + url + strFilterToAppend,
			method:			type,
			data:			dataCopy,
			headers:		finalHeaders
		}).then( result => {
			if(isDataOnly) {
				return result.data as GetDataType | PostDataType | DeleteDataType;
			} else {
				const anyResult = result as any;
				anyResult.data = anyResult.data as GetDataType | PostDataType | DeleteDataType;
				return anyResult;
			}
		}).catch( err => {
			/* sorry guys
			 * this part of auth manipulation should not be here. But right now refactoring of new auth, new services and
			 * all new shiny staff not ready. So, I'm just putting this code here with hope that it will be removed in
			 * very near future
			 */
			const optHttpStatus = propz.get(err, ['response', 'status'], undefined);
			if(optHttpStatus === 401) {
				// perform deauth
				this.binding.sub('sessions').clear();
				setTimeout(() => {			// holy, holy, holy crap
					window.location.reload();		// I'm doing this because by default login page is in "select role" state
				}, 2000)						// some time required for all binding listeners to do their job
			}

			throw err;
		});
	}

	private getActiveSession(): ActiveSession | undefined {
		if(typeof this.binding !== 'undefined') {
			const result = SessionHelper.getActiveSession(this.binding);
			return result as ActiveSession;
		}
	}

	/**
	 * In external calls (.get, .post, etc) `options` is either value of the only param if url is parametrized,
	 * or object with params, or data if there is no params.
	 * This method normalizes `options` and `data` by guessing who is who and returning normalized `options` and `data`,
	 * where first one really is options set and second one is really data set.
	 * @param options
	 * @param {object} data
	 * @return {{data?: Data, options?: object}}
	 */
	private getPreparedDataForCallService(options?: any, data?: Data): { data?: Data, options?: object} {
		const preparedData = {
			data:       undefined,
			options:    undefined
		};

		const isParamsRequired = this.requiredParams.length > 0;

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

			case isParamsRequired  && typeof options === 'object': {
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

	private showError() {
		log.error(`Service ${this.url} expects params: ${this.requiredParams}`);
	}

	/**
	 * Function returns headers object from arg data from function _callService
	 * @param data
	 */
	private static getHeaders(data: object): FlatObject {
		return propz.get(data, ['options', 'headers'], {});
	}

	/**
	 * Function returns isDataOnlyFlag flag from agr data from function _callService
	 * If isDataOnly is undefined then functions returns true by default
	 * @param data
	 */
	private static getIsDataOnlyFlag(data: object): boolean {
		return propz.get(data, ['options', 'isDataOnly'], true);
	}

	/**
	 * Function just checks sources for filter and returns first not undefined filter
	 * @param sources
	 * @returns {object|undefined}
	 */
	private static getFilter(sources: object[]): object | undefined {
		for(let i = 0; i < sources.length; i++) {
			const tempFilter = propz.get(sources, [i, 'filter'], undefined);

			if(typeof tempFilter !== 'undefined') {
				return { ...tempFilter };
			}
		}
	}
}