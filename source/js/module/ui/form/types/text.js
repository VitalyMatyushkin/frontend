const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		React 		= require('react');

const TypeText =  React.createClass({
	propTypes: {
		htmlId: 		React.PropTypes.string,
		textType: 		React.PropTypes.string
	},
	mixins: [Morearty.Mixin, TypeMixin],
	componentWillMount: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		// For case when form filled async
		// HOLY GUACAMOLE!!!
		binding.addListener('defaultValue', function() {
			self._forceNewValue(binding.get('defaultValue'));
		});
	},
	/** looks like this function used for setting default value when input is empty */
	_forceNewValue: function(value) {
		const self = this;
		/* if there is both `value` and `fieldInput` ref */
		if (value !== undefined && self.refs.fieldInput && self.refs.fieldInput.value === '') {
			self.refs.fieldInput.value = value;
			self.fullValidate(value);
		}
	},
	handleBlur: function(event) {
		this.setValue(event.target.value);
	},
	handleChange: function(event) {
		this.changeValue(event.target.value);
	},
	render: function () {
		const 	self 			= this,
				defaultValue 	= self.getDefaultBinding().get('defaultValue');

		return (
			<div className="eForm_fieldInput">
				<input ref="fieldInput" type={self.props.textType || 'text'} placeholder={self.props.placeholder} id={self.props.htmlId} onBlur={self.handleBlur} onChange={self.handleChange} />
			</div>
		)
	}
});


module.exports = TypeText;