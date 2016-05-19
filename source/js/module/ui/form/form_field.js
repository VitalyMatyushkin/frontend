const 	React 		= require('react'),
        classNames  = require('classnames'),
		typeList 	= require('module/ui/form/types/type_list');

const FormField = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		type: 				React.PropTypes.string.isRequired,
		field: 				React.PropTypes.string.isRequired,
		validation:			React.PropTypes.string,
        errorClassName:		React.PropTypes.string, //Error message specific class
        fieldClassName:		React.PropTypes.string,
		binding:			React.PropTypes.any
	},
	render: function () {
		const 	self 	= this,
				binding = self.getDefaultBinding(),
                success = '&#x2713;',
                error   = '&#x26a0;',
                html    = {__html: binding.get('showError') ? error : success};

		/* collectin all own props and adding some more additional component-specific */
		const inputProps = Object.assign({}, self.props, {
			name: 		self.props.children,
			service: 	self.props.service,
			binding: 	binding
		});

		/* creating new input with built props */
		const inputField = React.createElement(typeList[self.props.type], inputProps);

		const fieldStyleClass = classNames('eForm_fieldSet', {
                                    mInvalid: 	binding.get('showError'),
                                    mValid: 	binding.get('showSuccess')
                                });
		//If a specific class has been provided for styling error messages then use it
		const errorClassName = classNames("eForm_fieldValidText", self.props.errorClassName);
		return (
			<div className={classNames("eForm_field", self.props.fieldClassName)}>
				<div className="eForm_fieldName">{self.props.children}</div>
				<div className={fieldStyleClass}>
					{inputField}
					<div className={errorClassName} title={binding.get('error') || ''} dangerouslySetInnerHTML={html} />
				</div>
			</div>

		)
	}
});

module.exports = FormField;
