var PromiseClass = require('module/core/promise'),
	baseUrl = 'http://api.squadintouch.com:80/v1',
	Service;


Service = (function() {
	var Service;

	Service = function(url, binding) {
		var self = this;

		self.url = url;
		self.binding = binding;

		// Обработка параметров, если они содержатся в URL-адресе
		if (url.indexOf('{') !== -1) {
			self.requredParams = [];

			url.replace(/\{(.*?)\}/g, function(match, param){
				self.requredParams.push(param);
			});
		}

	};

	Service.prototype = {
		_callService: function(type, options, data) {
			var self = this,
				url = self.url,
				filter = '',
				promise = new PromiseClass(),
				authorization = self.binding.get();

			if (self.requredParams) {
				url = url.replace(/\{(.*?)\}/g, function(match, param) {
					return options[param];
				});
			}

			if (options && options.filter) {
				filter = options.filter;
			}

			self.currentRequest = $.ajax({
				url: baseUrl + url + filter,
				type: type,
				crossDomain: true,
				data: data,
				dataType: 'json',
				contentType: 'application/json',
				error: function(data) {
					promise.reject(data);
				},
				success: function(data) {
					promise.resolve(data);
				},
				beforeSend: function (xhr) {
					var authorizationInfo = authorization.toJS();

					if (authorizationInfo && authorizationInfo.id) {
						xhr.setRequestHeader ('Authorization', authorizationInfo.id);
					}
				}
			});

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

				if (typeof  options !== 'object') {
					// Если в параметры передается не объект, но ожидается несколько параметров
					if (self.requredParams.length > 1) {
						self._showError();
					} else {
						sendOptions = {};
						sendOptions[self.requredParams[0]] = arguments[0];
					}
				}
			} else {
				data = options;
				sendOptions = undefined;
			}

			return self._callService(method.toUpperCase(), sendOptions, data);
		}
	});

	return Service;
})();









module.exports = Service;