/**
 * Раздичные виды валидации
 * @type {{email: Function, alphanumeric: Function, any: Function, server: Function}}
 */
const 	$ 		= require('jquery');
let serverValidationTimer = null;

var validationsSet = {
	phone: function(value) {
        if(value && value.length < 7)
			return "Incorrect phone number!";
		else
			return false;

		//if (!(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test(value))) {
		//	return 'Should contain phone number';
		//} else {
		//	return false;
		//}
	},
	password:function(value){
		if(value && !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/).test(value)){
			return "Password must contain at least one capital, lower case character, one number and must be 8 digits long";
		}else{
			return false;
		}
	},
	date:function(value){
        const err = 'Incorrect date!';
		if(!Date.parse(value)){
			return err;
		}else{
            const date = new Date(value),
                valueArray = value.split('-'),
                day = valueArray[2].split('T')[0]*1,
                month = valueArray[1]*1,
                year = valueArray[0];
			if(date.getUTCFullYear() == year && date.getUTCMonth() == (month - 1) && date.getUTCDate() == day)
                return false;
            else
                return err;
		}
	},
	email: function(value) {
		var self = this;

		if (value && value.trim() && !(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value))) {
			return 'Please enter a valid '+self.props.name;
		} else {
			return false;
		}
	},
	alphanumeric: function(value) {
		var self = this;
        //old RegExp /[^a-zA-Z0-9\-\/]/
		if (/[^a-zA-Z0-9 \-\/]+$/.test(value)) { //Special symbols " " (space) and "-" (hyphen) should be allowed!
			return 'Should contain only alphanumeric characters';
		} else {
			return false;
		}
	},
	text: function(value) {
		var self = this;

		if (/[^a-zA-Z \-\/]/.test(value)) {//Special symbols " " (space) and "-" (hyphen) should be allowed!
			return 'Should contain only text characters';
		} else {
			return false;
		}
	},
	number: function(value) {
		if (/[0-9]/.test(value)) {
			return 'Should be number';
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
			return 'Please enter your '+self.props.name;
		} else {
			return false;
		}
	},
	termsAndConditions:function(value){
		if(value){
			//If there are other boxes selected
			//Lets check first index because we know it is the important one
			if(!value.Terms){
				return 'Please agree Terms and Conditions';
			}else{
				return false;
			}
		}else{
			return 'Please accept the Terms and Conditions';
		}
	},
	server: function(value, defaultValue) {
		const 	self = this,
				dataToCheck = {};

		if (value === '' || value === defaultValue) {
			return false;
		}
        if(self.props.onPrePost !== undefined){
            value = self.props.onPrePost(value);
        }
		dataToCheck[self.props.field] = value;

		//The value has changed before sending the request to the server. We reset the timer and start it again.
		clearTimeout(serverValidationTimer);
		// to validate more appropriate method Debouncing
		serverValidationTimer = setTimeout(function(){
			$.ajax({
				url: 			window.apiBase + '/' + self.props.service + '/check',
				type: 			'POST',
				dataType: 		'json',
				contentType: 	'application/json',
				crossDomain: 	true,
				data: 			JSON.stringify(dataToCheck), //prevents submitting form data which sometimes results in bad request and failure to check for availability
				error: function(data, error, errorText) {
					self.showError(`${self.props.name} has already been taken. Choose another or log in`);
				},
				success: function(data) {
					const status = data[self.props.field];

					if(status === true) {
						self.showSuccess('V');
					} else {
						self.showError(`${self.props.name} has already been taken. Choose another or log in`);
					}
				}
			});

		}, 400);
	}
};

module.exports =  validationsSet;