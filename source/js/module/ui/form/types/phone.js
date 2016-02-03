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
	componentWillReceiveProps:function(newProps){
		var self = this,
			binding = self.getDefaultBinding();
		if(binding.get('defaultValue')!==undefined && (newProps.binding.get('defaultValue') === binding.get('defaultValue'))){
			ReactDOM.findDOMNode(self.refs.fieldInput).value = newProps.binding.get('defaultValue');
		}
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
		}
	},
	handleBlur: function() {
		var self = this,
			inputValue = ReactDOM.findDOMNode(self.refs.fieldInput).value;

		self.setValue(inputValue);
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
				<MaskedInput ref="fieldInput" onBlur={self.handleBlur} onChange={self.handleChange} mask="(999)999-9999" />
			</div>
		)
	}
});


module.exports = TypePhone;