/**
 * Раздичные виды валидации
 * @type {{email: Function, alphanumeric: Function, any: Function, server: Function}}
 */
var validationsSet = {
	email: function(value) {
		var self = this;

		if (!(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value))) {
			return 'Should contain only email address';
		} else {
			return false;
		}
	},
	alphanumeric: function(value) {
		var self = this;

		if (/[^a-zA-Z0-9\-\/]/.test(value)) {
			return 'Should contain only alphanumeric characters';
		} else {
			return false;
		}
	},
	any: function() {
		return false;
	},
	required: function(value) {
		var self = this;

		if (value.trim && value.trim() === '' ) {
			return 'Please fill out this field';
		} else {
			return false;
		}
	},
	server: function(value) {
		var self = this,
			dataToCheck = {};

		if (value === '') {
			return false;
		}

		dataToCheck[self.props.field] = value;

		$.ajax({
			url: 'http://api.squadintouch.com:80/v1/' + self.props.service + '/check',
			type: 'POST',
			crossDomain: true,
			data: dataToCheck,
			error: function(data) {
				debugger
			},
			success: function(data) {
				var self = this;

				// Проверяем, актуально ли проверяемое значение поля
				if (data.unique === false && self.getDefaultBinding().get('value') === value) {
					self.showError(self.props.name + ' has already been taken. Choose another one or log in.');
				}
			}
		});
	}
};

module.exports =  validationsSet;