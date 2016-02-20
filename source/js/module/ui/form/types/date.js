var TypeMixin = require('module/ui/form/types/type_mixin'),
	MaskedInput = require('module/ui/masked_input'),
	React = require('react'),
	ReactDOM = require('reactDom'),
	TypeDate;

// mm.dd.fullyear
TypeDate =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

		// На случай, если форма заполняется асинхронно
		binding.addListener('defaultValue', function() {
			self._forceNewValue(binding.get('defaultValue'));
		});
	},
	//Prepare date to be user friendly
	_reverseDefaultDateValue:function(value){
		var valueArray = value.split('-'),
			day = valueArray[2].split('T');
		return 	valueArray[1]+'.'+day[0]+'.'+valueArray[0];
	},
	_forceNewValue: function(value) {
		var self = this,
			dateString,
			date;
		if (value !== undefined && self.refs.fieldInput && (self.refs.fieldInput.value === '' || self.refs.fieldInput.value === '__.__.____')) {
			dateString = new Date(value).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

			self.refs.fieldInput.value = dateString;
			self.fullValidate(value);
		}else{
			if(value !== undefined && self.refs.fieldInput){
				self.fieldInputValue = self._reverseDefaultDateValue(value);
				self.setValue(self._converToIso(self.fieldInputValue));
			}
		}
	},
	_converToIso: function(dotString) {
		var self = this,
			dateParts = dotString !== undefined ? dotString.split('.'):'',
			inputDate = new Date();
		if (dateParts.length === 3 && (dateParts[0] > 0 && dateParts[0] < 13) && (dateParts[1] > 0 && dateParts[1] < 32) && (dateParts[2])) {
			inputDate.setUTCFullYear(dateParts[2],dateParts[0]-1,dateParts[1]);
			return inputDate.toString() === 'Invalid Date' ? '' : inputDate.toISOString();
		}

		//return '';
	},
	handleBlur: function() {
		var self = this,
			inputValue = ReactDOM.findDOMNode(self.refs.fieldInput).value;
		//There is a default value (Old data) and the input value is empty then set the value to old one
		//Else set to new input
		if(inputValue === '__.__.____'  && self.fieldInputValue !== undefined){
			self.setValue(self._converToIso(self.fieldInputValue));
		}else{
			self.setValue(self._converToIso(inputValue));
		}
	},
	handleChange: function() {
		var self = this,
			inputValue = ReactDOM.findDOMNode(self.refs.fieldInput).value;
		self.changeValue(self._converToIso(inputValue));
	},
	render: function () {
		var self = this,
			defaultValue = self.getDefaultBinding().get('defaultValue');
		//self._forceNewValue(defaultValue);

		return (
			<div className="eForm_fieldInput">
				<MaskedInput ref="fieldInput" value={self.fieldInputValue} onBlur={self.handleBlur} onChange={self.handleChange} mask="99.99.9999" />
				<span className="dateFormat">Date format:MM/DD/YYYY</span>
			</div>
		)
	}
});


module.exports = TypeDate;