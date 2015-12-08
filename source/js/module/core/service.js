var PromiseClass = require('module/core/promise'),
	$ = require('jquery'),
	Promise = require('bluebird'),
	log = require('loglevel'),
	AJAX = require('module/core/AJAX'),
	baseUrl = window.apiBase,
	ServiceConstructor;

/** Build ServiceConstructor which is kind of accessor to given url.
 *  Example:
 *  var users = new Service('/users', binding);
 *  users.get();
 **/
ServiceConstructor = (function() {
	var Service;	// service instance to return

	Service = function(url, binding) {
		var self = this;

		self.url = url;
		self.binding = binding;

		/* Processing params from provided url. All unique params enclosed in curly brackets will be stored in array */
		var urlParams = _extractUrlParams(url);
		self.requredParams = urlParams.length === 0 ? undefined : urlParams;
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

	Service.prototype = {
		/**
		 * Assembles request from given params and performs it with jquery's $.ajax
		 * @param type HTTP verb
		 * @param options
		 * @param data
		 * @returns {*}
		 * @private
		 */
		_callService: function(type, options, data) {
			var self = this,
				url = self.url,
				filter = options && options.filter || data && data.filter || '',
				promise0 = new PromiseClass(),
				authorization = self.binding ? self.binding.get() : undefined;

			if (self.requredParams) {
				url = url.replace(/\{(.*?)\}/g, function(match, param) {
					return options[param];
				});
			}
			//Added condition to test for executions where there are no schoolId or other ids set for request
			//Tests for options being equal to null
			if (filter) {
				filter = 'filter=' + JSON.stringify(filter);
				filter = url.indexOf('?') !== -1 ? '&' + filter : '?' + filter;
				if (typeof options === 'object' && options !== null) {
					delete options.filter;
				}

				if (typeof data === 'object') {
					delete data.filter;
				}
			}

			self.currentRequest2 = AJAX({
				url: baseUrl + url + filter,
				type: type,
				crossDomain: true,
				data: JSON.stringify(data),
				dataType: 'json',
				contentType: 'application/json',
				beforeSend: function (xhr) {
					var authorizationInfo;
					if (authorization) {
						authorizationInfo = authorization.toJS();
						if (authorizationInfo && authorizationInfo.id) {
							xhr.setRequestHeader('Authorization', authorizationInfo.id);
						}
					}
				}
			});

			self.currentRequest = $.ajax({
				url: baseUrl + url + filter,
				type: type,
				crossDomain: true,
				data: JSON.stringify(data),
				dataType: 'json',
				contentType: 'application/json',
				error: function(data) {
					promise0.reject(data);
				},
				success: function(data) {
					promise0.resolve(data);
				},
				beforeSend: function (xhr) {
					var authorizationInfo;
					if (authorization) {
						authorizationInfo = authorization.toJS();
						if (authorizationInfo && authorizationInfo.id) {
							xhr.setRequestHeader('Authorization', authorizationInfo.id);
						}
					}

				}
			});

			var promise = Promise.resolve(self.currentRequest);

			promise0.abort = function() {
				// TODO: Very sticky situation here...
				// TODO: Do something with cancellable - http://bluebirdjs.com/docs/api/cancellation.html
				self.currentRequest.abort();
				//promise.cancel();
			};

			return promise0;
		},

		_showError: function() {
			var self = this;
			console.error('Service ' + self.url +' expects params: ' + self.requredParams);
		},

		abort: function() {
			var self = this;
			log.error("@@@@ Why this fucking need?");
			if (self.currentRequest && self.currentRequest.abort) {
				self.currentRequest.abort();
			}
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
