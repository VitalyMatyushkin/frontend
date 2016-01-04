/**
 * Раздичные виды валидации
 * @type {{email: Function, alphanumeric: Function, any: Function, server: Function}}
 */
var React = require('react');
var validationsSet = {
	phone: function(value) {

		if (!(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test(value))) {
			return 'Should contain phone number';
		} else {
			return false;
		}
	},
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
        //old RegExp /[^a-zA-Z0-9\-\/]/
		if (/[^a-zA-Z0-9\-\/]+$/.test(value)) {
			return 'Should contain only alphanumeric characters';
		} else {
			return false;
		}
	},
	text: function(value) {
		var self = this;

		if (/[^a-zA-Z\-\/]/.test(value)) {
			return 'Should contain only text characters';
		} else {
			return false;
		}
	},
	any: function() {
		return false;
	},
	required: function(value) {
		var self = this,
			value = value || '';

		if (value.trim && value.trim() === '' ) {
			return 'Please fill out this field';
		} else {
			return false;
		}
	},
	server: function(value) {
		var self = this,
            oldPhoneCheckVal,
			dataToCheck = {};
		if (value === '') {
			return false;
		}
        if(self.props.onPrePost !== undefined){
            oldPhoneCheckVal = value;
            value = self.props.onPrePost(value);
        }
		dataToCheck[self.props.field] = value;
		$.ajax({
			url: 'http:' + window.apiBase + '/' + self.props.service + '/check',
			type: 'POST',
			crossDomain: true,
			data: dataToCheck,
			error: function(data, error, errorText) {
				// Проверяем, актуально ли проверяемое значение поля
				if (errorText === 'Conflict' && self.getDefaultBinding().get('value') === value) {
					self.showError(self.props.name + ' has already been taken. Choose another one or log in.');
				}
			},
			success: function(data) {
				// Проверяем, актуально ли проверяемое значение поля
				if (data.unique === false && self.getDefaultBinding().get('value') === value) {
					self.showError(self.props.name + ' has already been taken. Choose another one or log in.');
				}else if(data.unique === false && self.getDefaultBinding().get('value') === oldPhoneCheckVal){
                    self.showError(self.props.name + ' has already been taken. Choose another one or log in.');
                }else{
                    self.showSuccess(self.props.name +' is available to you');
                }
			}
		});
	}
};

module.exports =  validationsSet;