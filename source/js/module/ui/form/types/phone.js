var TypeMixin = require('module/ui/form/types/type_mixin'),
	MaskedInput = require('module/ui/masked_input'),
	React = require('react'),
	ReactDOM = require('reactDom'),
	TypePhone;

// (___)___-____
TypePhone =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

		// На случай, если форма заполняется асинхронно
		binding.addListener('defaultValue', function() {
			self._forceNewValue(binding.get('defaultValue'));
		});
	},
	componentWillUnmount:function(){
		var self = this,
			binding = self.getDefaultBinding();
		binding.remove();
	},
	_forceNewValue: function(value) {
		var self = this,
			oldValue;

		if (value !== undefined && self.refs.fieldInput && ReactDOM.findDOMNode(self.refs.fieldInput).value === '(___)___-____') {
			ReactDOM.findDOMNode(self.refs.fieldInput).value = value;
			self.fullValidate(value);
		}else{
			if(value !== undefined && self.refs.fieldInput){
				self.fieldInputValue = value;
				self.setValue(self.fieldInputValue);
			}
		}
	},
	handleBlur: function() {
		var self = this,
			inputValue = ReactDOM.findDOMNode(self.refs.fieldInput).value;
		//There is a default value (Old data) and the input value is empty then set the value to old one
		//Else set to new input
		if(inputValue ==='(___)___-____' && self.fieldInputValue !== undefined ){
			self.setValue(self.fieldInputValue);
		}else{
			self.setValue(inputValue);
		}
	},
	handleChange: function() {
		var self = this,
			inputValue = ReactDOM.findDOMNode(self.refs.fieldInput).value;

		self.changeValue(inputValue);
	},
	render: function () {
		var self = this,
			defaultValue = self.getDefaultBinding().get('defaultValue');

		//self._forceNewValue(defaultValue);

		return (
			<div className="eForm_fieldInput">
				<MaskedInput ref="fieldInput" value={self.fieldInputValue} onBlur={self.handleBlur} onChange={self.handleChange} mask="(999)999-9999" />
			</div>
		)
	}
});


module.exports = TypePhone;