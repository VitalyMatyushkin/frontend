const 	log 			= require('loglevel'),
		propz			= require('propz'),
		SessionHelper	= require('module/helpers/session_helper'),
		AJAX 			= require('module/core/AJAX');


/**
 * using global vars is really bad practice. And that's why:
 * it is intentionally made as function to be called only when window.apiBase is really set.
 * This is a bit hacky, but we will drop this shit soon
 */
const baseUrl = () => window.apiBase;



/** Build ServiceConstructor which is kind of accessor to given url.
 *  Example:
 *  var users = new Service('/users', binding);
 *  users.get();
 **/
const ServiceConstructor = (function() {

	const Service = function(url, binding) {	// service instance to return
		this.url = url;
		this.binding = binding;

		/* Processing params from provided url. All unique params enclosed in curly brackets will be stored in array */
		var urlParams = _extractUrlParams(url);
		this.requredParams = urlParams.length === 0 ? undefined : urlParams;
	};

	/**
	 * Extracts params enclosed in curly braces from given string.
	 * Example:
	 * 		/users/{id}/friends/{friend_id}  -> [id, friend_id]
	 * 		/users -> []
	 * @param url string which contains params in curly braces like '/user/{id}'
	 * @returns {Array} array of extracted params
	 * @private
	 */
	function _extractUrlParams(url){
		var urlParams = [];
		if (url.indexOf('{') !== -1) {
			url.replace(/\{(.*?)\}/g, function(match, param) {
				if (urlParams.indexOf(param) === -1) {
					urlParams.push(param);
				}
			});
		}
		return urlParams;
	}

	/**
	 * Function just checks sources for filter
	 * and returns first not undefined filter
	 * @param sources
	 * @returns {string}
	 */
	function getFilter(sources) {
		let filter = '';

		if(typeof sources !== 'undefined') {
			for(let i = 0; i < sources.length; i++) {
				const tempFilter = propz.get(sources, [i, 'filter']);

				if(typeof tempFilter !== 'undefined') {
					filter = Object.assign({}, tempFilter);
					break;
				}
			}
		}

		return filter;
	}

	/**
	 * Function returns headers object from agr data from function _callService
	 * @param data
	 */
	function getHeaders(data) {
		const headers = propz.get(data, ['options', 'headers']);

		return typeof headers !== 'undefined' ? headers : '';
	}

	/**
	 * Function returns isDataOnlyFlag flag from agr data from function _callService
	 * If isDataOnly is undefined then functions returns true by default
	 * @param data
	 */
	function getIsDataOnlyFlag(data) {
		const isDataOnly = propz.get(data, ['options', 'isDataOnly']);

		return typeof isDataOnly !== 'undefined' ? isDataOnly : true;
	}

	function removeOptions(data) {
		const options = propz.get(data, ['options']);

		if(typeof options !== 'undefined') {
			delete data.options;
		}
	}

	Service.prototype = {
		/**
		 * Assembles request from given params and performs it with jquery's $.ajax
		 * @param type HTTP verb
		 * @param requestParams
		 * @param data
		 * @returns {*}
		 * @private
		 */
		_callService: function(type, requestParams, data) {
			const self = this;

			// copy data because we will change it
			const dataCopy = Object.assign({}, data);

			// get options
			const headers = getHeaders(dataCopy);
			const isDataOnly = getIsDataOnlyFlag(dataCopy);
			// and remove it from data
			// because in the end dataCopy should contain only data for post/put method
			// yep it's ugly design we should refactor it
			removeOptions(dataCopy); // !! Modify args

			// TODO need refactoring
			// remove cases when we put filter to requestParams
			let filter = getFilter([requestParams, dataCopy]);

			let url = self.url;


			const activeSession = typeof self.binding !== 'undefined' ?
					SessionHelper.getActiveSession(self.binding) :
					undefined;

			if (self.requredParams) {
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

			return AJAX({
				url: 			baseUrl() + url + filter,
				type: 			type,
				crossDomain: 	true,
				data: 			JSON.stringify(dataCopy),
				dataType: 		'json',
				contentType: 	'application/json',
				headers:		headers,
				beforeSend: function (xhr) {
                    if (activeSession && activeSession.id) {
                        const headerName = activeSession.adminId ? "asid" : "usid";
                        xhr.setRequestHeader(headerName, activeSession.id);
                    }
					xhr.setRequestHeader('App-Signature', 'SquadInTouch-Web, 1.0.0');
				}
			}, isDataOnly); // TODO: sanitize me
		},

		_showError: function() {
			var self = this;
			log.error('Service ' + self.url +' expects params: ' + self.requredParams);
		}
	};

	['post', 'put', 'get', 'head', 'delete'].forEach(function(method) {
		Service.prototype[method] = function(options, data) {
			var self = this,
				sendOptions;

			// If params expected
			if (self.requredParams) {
				// but there is no params - return false and log an error
				if (!options && !data) {
					self._showError();
					return false;
				}

				if (typeof	options !== 'object') {
					// if options is not an object but we expecting multiple params.. error
					if (self.requredParams.length > 1) {
						self._showError();
						return false;
					} else {
						sendOptions = {};
						sendOptions[self.requredParams[0]] = options;
					}
				} else {
					sendOptions = options;
				}

			} else {
				data = data || options;
				sendOptions = options;
			}

			return self._callService(method.toUpperCase(), sendOptions, data);
		}
	});

	return Service;
})();

module.exports = ServiceConstructor;
