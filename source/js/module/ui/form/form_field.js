const 	React 		= require('react'),
		typeList 	= require('module/ui/form/types/type_list');

const FormField = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		type: 				React.PropTypes.string.isRequired,
		field: 				React.PropTypes.string.isRequired,
		defaultValueString:	React.PropTypes.string,
		binding:			React.PropTypes.any
	},
	render: function () {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		/* collectin all own props and adding some more additional component-specific */
		const inputProps = Object.assign({}, self.props, {
			name: 		self.props.children,
			service: 	self.props.service,
			binding: 	binding
		});

		/* creating new input with built props */
		const inputField = React.createElement(typeList[self.props.type], inputProps);

		let fieldStyleClass = 'eForm_fieldSet';
		if (binding.get('showError')) {
			fieldStyleClass += ' mInvalid';
		} else if(binding.get('showSuccess')){
			fieldStyleClass += ' mValid';
        }
		return (
			<div className="eForm_field">
				<div className="eForm_fieldName">{self.props.children}</div>
				<div className={fieldStyleClass}>
					{inputField}
					<div className="eForm_fieldValidText">{binding.get('error') || binding.get('success')}</div>
				</div>
			</div>

		)
	}
});

module.exports = FormField;
