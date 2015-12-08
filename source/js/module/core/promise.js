// TODO: drop me in favour of normal promises. Q preffered.

var bbPromise = require('bluebird');
var log = require('loglevel');

var PromiseClass = function() {
	var self = this;
	console.error("@@@@ Attention! Warning! Achtung! Don't use that shitty promise. Use bluebird instead");

	self.status = false;
	self.result = undefined;
	self.callbacks = [];
};

PromiseClass.prototype = {
	then: function(nextCallback, errorCallback){
		var self = this,
			lastCallback;

		lastCallback = {
			fulfilled: nextCallback || function(){},
			rejected: errorCallback || function(){}
		};

		if(!self.status){
			self.callbacks.push(lastCallback);
		} else {
			self.result = self._runCallback(lastCallback);
		}

		return self;
	},
	_runCallback: function(callbackSet) {
		var self = this,
			callResult;

		callResult = callbackSet[self.status].call(this, self.result);

		return callResult || self.result;
	},
	_resolve: function(result, status) {
		var self = this;

		if(!self.status){
			self.status = status;
			self.result = result;

			self.callbacks.forEach(function(callbackSet) {
				self.result = self._runCallback(callbackSet);
			});
		}
	},
	resolve: function(result) {
		var self = this;
		self._resolve(result, 'fulfilled');
	},
	reject: function(result) {
		var self = this;
		self.__truePromise = bbPromise.reject(result);
		self._resolve(result, 'rejected');
	}
};


module.exports = PromiseClass;