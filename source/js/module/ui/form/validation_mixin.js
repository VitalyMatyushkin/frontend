var ValidationMixin;

ValidationMixin = {
	componentWillMount: function() {
		var self = this;

		self.validations = {};

		if (self.props.validation) {
			self.props.validation.split(' ').forEach(function(validType) {
				self.validations[validType] = false;
			});
		}
	},
	validate: function(value) {
		var self = this;

		if (self.validations.hasOwnProperty('alphanumeric') && /[^a-zA-Z0-9\-\/]/.test(value)) {
			return 'Should contain only alphanumeric characters';
		}

		if (self.validations.hasOwnProperty('email') && !(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value))) {
			return 'Should contain only email address';
		}


		return false;
	}
};

module.exports = ValidationMixin;
