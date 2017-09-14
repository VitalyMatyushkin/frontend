/**
 * Раздичные виды валидации
 * @type {{email: Function, alphanumeric: Function, any: Function, server: Function}}
 */
const 	$ 			= require('jquery'),
		DateHelper 	= require('module/helpers/date_helper');

let serverValidationTimer = null;

var validationsSet = {
	phone: function(value) {
        if(value && value.length < 7)
			return "Please enter a valid mobile phone number";
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
		const 	minValue = new Date('1900-01-01'),
				maxValue = new Date('2100-01-01');

		if(value){
			if(!DateHelper.isValid(value)){
				return 'Incorrect date!';
			}

			const date = new Date(value);

			if(date <= minValue){
				return 'Date should be > "01/01/1900"';
			}
			if(date >= maxValue){
				return 'Date should be < "01/01/2100"';
			}
		}

		return false;
	},
	datetime:function(value){
		const 	minValue = new Date('1900-01-01'),
				maxValue = new Date('2100-01-01');
		if(value){
			if(!DateHelper.isValidDateTime(value)){
				return 'Incorrect date!';
			}

			const date = new Date(value);

			if(date <= minValue){
				return 'Date should be > "01/01/1900"';
			}
			if(date >= maxValue){
				return 'Date should be < "01/01/2100"';
			}
		}

		return false;
	},
	birthday:function(value){
		let result = validationsSet.date(value);
		if(!result && value){
			const date = new Date(value),
				maxDate = new Date();

			if(date >= maxDate){
				result = 'Birthday must be less than the current date.';
			}
		}

		return result;
	},
	postcode:function (value) {
		if(!(/^[a-zA-Z0-9\/]{2,4}\s[a-zA-Z0-9\/]{3}$/).test(value)){
			return 'should be have one of formats XXXX XXX, XXX XXX, XX XXX and should contain only characters and digits';
		} else {
			return false;
		}
	},
	longitude:function (value) {
		let result = false;
		if (value && (value >= 180 || value <= -180)) {
			result = 'Longitude should be >= -180 and <= 180';
		}
		return result;
	},
	latitude:function (value) {
		let result = false;
		if (value && (value >= 90 || value <= -90)) {
			result = 'Latitude should be >= -90 and <= 90';
		}
		return result;
	},
	email: function(value) {
		var self = this;

		if (value && value.trim() && !(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value))) {
			return 'Please enter a valid '+self.props.name;
		} else {
			return false;
		}
	},
	domain: function(value){
		if (/[^a-z0-9\-]/.test(value)) {//Special symbols "-" (hyphen) should be allowed!
			return 'Should contain only lowercase characters and digits';
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
		if (/[^a-zA-Z \-\/]/.test(value)) {//Special symbols " " (space) and "-" (hyphen) should be allowed!
			return 'Should contain only text characters';
		} else {
			return false;
		}
	},
	number: function(value) {
		if(!isNaN(parseFloat(value)) && isFinite(value)) {
			return false;
		} else {
			return 'Should be number';
		}
	},
	any: function() {
		return false;
	},
	required: function(value) {
		var self = this;
		//Because has case, where value === 0 and it must be true
		if (value !== 0) {
			value = value || '';
		}
		
		if (value.trim && value.trim() === '' ) {
			switch (self.props.name) {
				case 'Name':
					return 'Please enter your name';
				case 'Surname':
					return 'Please enter your surname';
				case 'Email':
					return 'Please enter a valid email address';
				case 'Phone':
					return 'Please enter a valid mobile phone number';
				default:
					return 'Please enter ' + self.props.name;
			}
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
			const service = typeof self.props.service !== 'undefined' ? self.props.service : 'i/register';
			$.ajax({
				url: 			window.apiBase + '/' + service + '/check',
				type: 			'POST',
				dataType: 		'json',
				contentType: 	'application/json',
				crossDomain: 	true,
				data: 			JSON.stringify(dataToCheck), //prevents submitting form data which sometimes results in bad request and failure to check for availability
				error: function(data, error, errorText) {
					self.showError(`This ${self.props.name} has already been used, please choose an alternative or log in`);
				},
				success: function(data) {
					const status = data[self.props.field] || data.isAvailable;

					if(status === true) {
						self.showSuccess('V');
					} else {
						self.showError(`This ${self.props.name} has already been used, please choose an alternative or log in`);
					}
				}
			});

		}, 400);
	}
};

module.exports =  validationsSet;