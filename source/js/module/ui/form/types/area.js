var TextMixin = require('module/ui/form/types/text_mixin'),
	TypeMixin = require('module/ui/form/types/input_mixin'),
	AreaMixin,
	Area;

AreaMixin = {
	cssClass: 'mAreaField',
	changeValue: function(event) {
		var self = this,
			value = event.currentTarget.value;

		self.hideError();

		clearTimeout(self.checkTimer);
		self.checkTimer = setTimeout(function() {
			self.tryToSetNewArea(value);
		}, 3000);
	},
	setValue: function(event) {
		var self = this,
			binding = self.getDefaultBinding(),
			value = event.currentTarget.value,
			oldValue = binding.get('value');

		if (oldValue === value) {
			return false;
		}

		self.tryToSetNewArea(value);
	},
	tryToSetNewArea: function(value) {
		var self = this,
			value = value.toUpperCase(),
			binding = self.getDefaultBinding();

		if (!value) {
			return false;
		}

		if (self.requset && self.requset.abort) {
			self.requset.abort();
		}
		//
		self.requset = $.ajax({
			url: 'http://api.squadintouch.com/v1/zipcodes/findOne?filter[where][zipCode]=' + value,
			type: 'GET',
			crossDomain: true,
			error: function(data, error, errorText) {
				// Проверяем, актуально ли проверяемое значение поля
				if (errorText === 'Not Found') {
					self.showError('Unknown zip code ' + value);
				}
			},
			success: function(data) {
				// Проверяем, актуально ли проверяемое значение поля
				if (data.id) {
					self.hideError();
					binding.set('error', false);
					binding.set('value', data.id);
				}
			}
		});
	}
};

Area = React.createClass({
	mixins: [Morearty.Mixin, TextMixin, $.extend({}, TypeMixin, AreaMixin)]
});

module.exports = Area;
