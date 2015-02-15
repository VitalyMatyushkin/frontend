var TextMixin = {
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
			oldValue;

		if (value !== undefined && self.refs.fieldInput && self.refs.fieldInput.getDOMNode().value === '') {
			self.refs.fieldInput.getDOMNode().value = value;
			self.fullValidate(value);
		}
	},
	render: function () {
		var self = this,
			defaultValue = self.getDefaultBinding().get('defaultValue');

		self._forceNewValue(defaultValue);

		return (
			<div className="eForm_fieldInput">
				<input ref="fieldInput" type="text" onBlur={self.setValue} onChange={self.changeValue} />
			</div>
		)
	}
};

module.exports = TextMixin;