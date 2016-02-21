const 	React 		= require('react'),
		typeList 	= require('module/ui/form/types/type_list');

const FormField = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		type: 				React.PropTypes.string.isRequired,
		field: 				React.PropTypes.string.isRequired,
		defaultValueString:	React.PropTypes.string,
		errorClassName:		React.PropTypes.string, //Error message specific class
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
		//If a specific class has been provided for styling error messages then use it
		let errorClassName = self.props.errorClassName !== undefined ? self.props.errorClassName:"eForm_fieldValidText";
		return (
			<div className="eForm_field">
				<div className="eForm_fieldName">{self.props.children}</div>
				<div className={fieldStyleClass}>
					{inputField}
					<span className={errorClassName} title={binding.get('error') || binding.get('success')} >!</span>
				</div>
			</div>

		)
	}
});

module.exports = FormField;
