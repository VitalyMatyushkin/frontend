var TypeMixin = require('module/ui/form/types/type_mixin'),
	TypeText;

TypeText =  React.createClass({
	propTypes: {
		textType: React.PropTypes.string
	},
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
			oldValue;

		if (value !== undefined && self.refs.fieldInput && self.refs.fieldInput.getDOMNode().value === '') {
			self.refs.fieldInput.getDOMNode().value = value;
			self.fullValidate(value);
		}
	},
	handeBlur: function(event) {
		var self = this;

		self.setValue(self.refs.fieldInput.getDOMNode().value);
	},
	handleChange: function(event) {
		var self = this;

		self.changeValue(self.refs.fieldInput.getDOMNode().value);
	},
	render: function () {
		var self = this,
			defaultValue = self.getDefaultBinding().get('defaultValue');

		self._forceNewValue(defaultValue);

		return (
			<div className="eForm_fieldInput">
				<input ref="fieldInput" type={self.props.textType || 'text'} onBlur={self.handeBlur} onChange={self.handleChange} />
			</div>
		)
	}
});


module.exports = TypeText;