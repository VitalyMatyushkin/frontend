const 	React 			= require('react'),
		validationsSet 	= require('module/ui/form/types/validations');


/**
 * Common class for all inputs in form
 * @type {{componentWillMount: Function, fullValidate: Function, typingValidate: Function, getInitialState: Function, changeValue: Function, setValue: Function, showError: Function, hideError: Function}}
 */
const InputTypeMixin = {
	propTypes: {
		onSetValue: React.PropTypes.func,
		validation: React.PropTypes.string  // string with validations, like that: 'require phone server'
	},
	componentWillMount: function() {
		const 	self 		= this,
				validations = {};

		// adding validation methods according to params
		if (self.props.validation) {
			self.props.validation.split(' ').forEach(function(validType) {
				const validator = validationsSet[validType] || validationsSet['any'];
				validations[validType] = validator.bind(self);
			});
		}
		self.validations = validations;
		self.fullValidate(self.getDefaultBinding().get('value'));
	},
	/**
	 * Checking if given value is valid according to given validType.
	 * Really just run validator on field if there is required validator.
	 *
	 * NOT RETURNS BOOLEAN!!! RETURNS FALSE | STRING
	 *
	 * @param value
	 * @param validType
	 * @returns FALSE if valid, MESSAGE if invalide
	 * @private
	 */
	_checkOneValid: function(value, validType) {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				validator	= self.validations[validType],
                defaultValue= binding.get('defaultValue');

		if(validator) {
			const validationResult = validator(value, defaultValue);
			binding.set('error', validationResult);		// TODO: I even can't imaging why fucking binding is here. I just re-structure code
			return validationResult;
		} else {
			return false;
		}
	},

	/**
	 * Full validation of given value
	 * @param value
	 * @returns {*}
	 */
	fullValidate: function(value) {
		const 	self 		= this,
				binding 	= self.getDefaultBinding();

		for (var validType in self.validations) {
			if (self._checkOneValid(value, validType)) {
				return true;
			}
		}

		binding.set('error', false);
		return false;
	},
	/**
	 * This method called during user's input. What it really does is hides errors if input data was changed
	 */
	changeValue: function(value) {
		const self = this;

		self.hideError();
		self._checkOneValid(value, 'alphanumeric') && self.showError();
		// just storing current input value
		// this can trigger extra form validation, but... emh.. it works.
		// anyway all that form shit should be dropped eventually
		self.getDefaultBinding().set('value', value);
	},

	/**
	 * Set input value on off field on input end
	 * @param value
	 */
	setValue: function(value) {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				oldValue 		= binding.get('value'),
				validateResult 	= self.fullValidate(value);

		if (validateResult)
			self.showError();
        else
			self.hideError();

        value = value || '';

        self.getDefaultBinding().set('value', value);
        self.props.onSetValue && self.props.onSetValue(value);
	},
	showError: function(text) {
		console.log('showing error');
		const 	self 	= this,
				binding = self.getDefaultBinding();
		text && binding.set('error', text);
		binding.set('showError', true);
	},
	hideError: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();
		binding.set('showError', false);
		binding.remove('error');
	},
    showSuccess:function(text){
        const 	self 	= this,
            	binding = self.getDefaultBinding();
        text && binding.set('success', text);
        binding.set('showSuccess',true);
    }
};

module.exports = InputTypeMixin;
