var InputTypeMixin,
	React = require('react'),
	ReactDOM = require('reactDom'),
	validationsSet = require('module/ui/form/types/validations');


/**
 * Общий класс для любых полей ввода на форме
 * @type {{componentWillMount: Function, fullValidate: Function, typingValidate: Function, getInitialState: Function, changeValue: Function, setValue: Function, showError: Function, hideError: Function}}
 */
InputTypeMixin = {
	propTypes: {
		onSetValue: React.PropTypes.func
	},
	componentWillMount: function() {
		var self = this;

		self.validations = {};

		// Добавление методов валидации в соответсвии с параметрами
		if (self.props.validation) {
			self.props.validation.split(' ').forEach(function(validType) {
				if (validationsSet[validType] !== undefined) {
					self.validations[validType] = validationsSet[validType].bind(self);
				} else {
					self.validations[validType] = validationsSet['any'].bind(self);
				}
			});
		}

		self.fullValidate(self.getDefaultBinding().get('value'));
	},
	/**
	 * Проверка валидности поля на заданный тип валидации
	 * @param value
	 * @param validType
	 * @returns {*}
	 * @private
	 */
	_checkOneValid: function(value, validType) {
		var self = this,
			binding = self.getDefaultBinding(),
			currentCheck;

		// Если данный тип валидации не предусмотрен
		if (!self.validations[validType]) {
			return false;
		}

		if ((currentCheck = self.validations[validType](value))) {
			binding.set('error', currentCheck);

			return currentCheck;
		}

		return false;
	},
	/**
	 * Полная валидация соответсвющих полей
	 * @param value
	 * @returns {*}
	 */
	fullValidate: function(value) {
		var self = this,
			binding = self.getDefaultBinding();

		for (var validType in self.validations) {
			if (self._checkOneValid(value, validType)) {
				return true;
			}
		}

		binding.set('error', false);
		return false;
	},
	/**
	 * Метод вызывается по мере изменения значения поля, выполняется частичная валидация
	 */
	changeValue: function(value) {
		var self = this,
			value = '';

		self.hideError();
		self._checkOneValid(value, 'alphanumeric') && self.showError();
	},
	/**
	 * Метод устаналивает значение поля (окончание ввода)
	 * @param value
	 */
	setValue: function(value) {
		var self = this,
			value = value || '',
			binding = self.getDefaultBinding(),
			oldValue = binding.get('value'),
			validateResult = self.fullValidate(value);

		if (oldValue === value) {
			return false;
		}

		if (value !== '' && validateResult) {
			self.showError();
		}else if(value ==='' && self.props.promptOnBlank){
			//Test against empty string and show error
			self.showError();
		}
		else{
			self.hideError();
		}

		self.getDefaultBinding().set('value', value);
		self.props.onSetValue && self.props.onSetValue(value);
	},
	showError: function(text) {
		var self = this,
			binding = self.getDefaultBinding();
		text && binding.set('error', text);
		binding.set('showError', true);
	},
	hideError: function() {
		var self = this,
			binding = self.getDefaultBinding();
		binding.set('showError', false);
	},
    showSuccess:function(text){
        var self = this,
            binding = self.getDefaultBinding();
        text && binding.set('success', text);
        binding.set('showSuccess',true);
    }
};

module.exports = InputTypeMixin;
