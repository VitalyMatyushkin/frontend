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
	_forceNewValue: function(value) {
		var self = this,
			dateString,
			date;
			//value;

		if (value !== undefined && self.refs.fieldInput && (self.refs.fieldInput.value === '' || self.refs.fieldInput.value === '__.__.____')) {
			date = new Date(value);
			dateString = ('0' + (date.getMonth()+1)).slice(-2) + '.' + ('0' + date.getDate()).slice(-2) + '.' + date.getFullYear();

			self.refs.fieldInput.value = dateString;
			self.fullValidate(value);
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
		self.setValue(self._converToIso(inputValue));
	},
	handleChange: function() {
		var self = this,
			inputValue = ReactDOM.findDOMNode(self.refs.fieldInput).value;
		self.changeValue(self._converToIso(inputValue));
	},
	render: function () {
		var self = this,
			defaultValue = self.getDefaultBinding().get('defaultValue');
		self._forceNewValue(defaultValue);

		return (
			<div className="eForm_fieldInput">
				<MaskedInput ref="fieldInput" onBlur={self.handleBlur} onChange={self.handleChange} mask="99.99.9999" />
				<span className="dateFormat">Date format:MM/DD/YYYY</span>
			</div>
		)
	}
});


module.exports = TypeDate;