var TypeMixin = require('module/ui/form/types/type_mixin'),
	TypeText;

TypeText =  React.createClass({
	propTypes: {
		textType: React.PropTypes.string,
        ignoreOnBlur: React.PropTypes.bool
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
		var self = this;

		if (value !== undefined && self.refs.fieldInput && self.refs.fieldInput.getDOMNode().value === '') {
			self.refs.fieldInput.getDOMNode().value = value;
			self.fullValidate(value);
		}
	},
	handleBlur: function(event) {
		var self = this;
		self.setValue(event.target.value);
	},
	handleChange: function(event) {
		var self = this;
		self.changeValue(event.target.value);
	},
	render: function () {
		var self = this,
			defaultValue = self.getDefaultBinding().get('defaultValue');

        if(!('ignoreOnBlur' in self.props) || (self.props.ignoreOnBlur === false)){
            if (typeof self.props.defaultValueString === 'undefined') {
                self._forceNewValue(defaultValue);
            } else {
                self._forceNewValue(self.props.defaultValueString);
            }
        }

		return (
			<div className="eForm_fieldInput">
				<input ref="fieldInput" type={self.props.textType || 'text'} onBlur={self.handleBlur} onChange={self.handleChange} />
			</div>
		)
	}
});


module.exports = TypeText;