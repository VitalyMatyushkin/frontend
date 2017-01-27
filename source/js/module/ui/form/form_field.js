const 	React 		= require('react'),
        classNames  = require('classnames'),
		Morearty    = require('morearty'),
		typeList 	= require('module/ui/form/types/type_list');

const FormField = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		id:					React.PropTypes.string,		// just html id to pass into real input field
		type: 				React.PropTypes.string.isRequired,
		field: 				React.PropTypes.string.isRequired,
		validation:			React.PropTypes.string,
		errorClassName:		React.PropTypes.string, //Error message specific class
		fieldClassName:		React.PropTypes.string,
		condition:			React.PropTypes.bool, 	//false - field is not included in the form, true or undefined - included
		isDisabled:			React.PropTypes.bool, 	//false - show field like disabled
		placeHolder:		React.PropTypes.string,
		onSelect:			React.PropTypes.func,
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
			name: 		self.props.children || self.props.field,
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

		/** props.condition === true or undefined */
		if(self.props.condition || typeof self.props.condition === 'undefined'){
			binding.set('active', true);
			return (
				<div className={classNames("eForm_field", self.props.fieldClassName)}>
					<div className="eForm_fieldName">{self.props.children}</div>
					<div className={fieldStyleClass}>
						{inputField}
						<div className={errorClassName} title={binding.get('error') || ''} dangerouslySetInnerHTML={html} />
					</div>
				</div>
			);
		} else {
			binding.set('active', false);
		}

		/** props.condition === false */
		return null;
	}
});

module.exports = FormField;
