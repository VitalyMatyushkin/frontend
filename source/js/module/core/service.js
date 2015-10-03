var PromiseClass = require('module/core/promise'),
	baseUrl = window.apiBase,
	Service;

//TODO Service in Service, WTF??
Service = (function() {
	var Service;

	Service = function(url, binding) {
		var self = this;

		self.url = url;
		self.binding = binding;

		// Processing parameters from provided url
		if (url.indexOf('{') !== -1) {
			self.requredParams = [];

			url.replace(/\{(.*?)\}/g, function(match, param) {
								if (self.requredParams.indexOf(param) === -1) {
										self.requredParams.push(param);
								}
			});
		}

	};

	Service.prototype = {

		_callService: function(type, options, data) {
			var self = this,
				url = self.url,
				filter = options && options.filter || data && data.filter || '',
				promise = new PromiseClass(),
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


			self.currentRequest = $.ajax({
				url: baseUrl + url + filter,
				type: type,
				crossDomain: true,
				data: JSON.stringify(data),
				dataType: 'json',
				contentType: 'application/json',
				error: function(data) {
					promise.reject(data);
				},
				success: function(data) {
					promise.resolve(data);
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

			promise.abort = function() {
				self.currentRequest.abort();
			};

			return promise;
		},

		_showError: function() {
			var self = this;

			console.error('Сервис ' + self.url +' ожидает параметры: ' + self.requredParams);
		},

		abort: function() {
			var self = this;

			if (self.currentRequest && self.currentRequest.abort) {
				self.currentRequest.abort();
			}
		}
	};

	['post', 'put', 'get', 'head', 'delete'].forEach(function(method) {
		Service.prototype[method] = function(options, data) {
			var self = this,
				sendOptions;

			// Если ожидается наличие параметров
			if (self.requredParams) {

				// Если параметры отсутствуют
				if (!options && !data) {
					self._showError();
					return false;
				}

				if (typeof	options !== 'object') {
					// Если в параметры передается не объект, но ожидается несколько параметров
					if (self.requredParams.length > 1) {
						self._showError();
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

module.exports = Service;
