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
		errorIconClass:		React.PropTypes.string,
		fieldClassName:		React.PropTypes.string,
		condition:			React.PropTypes.bool, 	//false - field is not included in the form, true or undefined - included
		isDisabled:			React.PropTypes.bool, 	//false - show field like disabled
		placeHolder:		React.PropTypes.string,
		onSelect:			React.PropTypes.func,
		isVisible:			React.PropTypes.bool,
		binding:			React.PropTypes.any,
		region:             React.PropTypes.string
	},
	getDefaultProps: function() {
		return {
			isVisible: true
		};
	},
	getErrorText: function() {
		const error = this.getDefaultBinding().get('error');

		return typeof error === 'string' ? error.toLowerCase() : '';
	},
	render: function () {
		const	binding = this.getDefaultBinding(),
                success = '&#x2713;',
                error   = '&#x26a0;',
                html    = {__html: binding.get('showError') ? error : success};

		/* collectin all own props and adding some more additional component-specific */
		const inputProps = Object.assign({}, this.props, {
			name: 		this.props.children || this.props.field,
			service: 	this.props.service,
			binding: 	binding
		});

		/* creating new input with built props */
		const inputField = React.createElement(typeList[this.props.type], inputProps);

		const fieldStyleClass = classNames('eForm_field',
			this.props.classNames, {
				mInvalid: binding.get('showError'),
				mValid: binding.get('showSuccess'),
				mInvisible: !this.props.isVisible
			});
		//If a specific class has been provided for styling error messages then use it
		const errorClassName = classNames("eForm_fieldValidText", this.props.errorClassName),
			  errorIconClass = classNames("eForm_fieldValidIcon", this.props.errorClassName);

		/** props.condition === true or undefined */
		if(this.props.condition || typeof this.props.condition === 'undefined'){
			binding.set('active', true);
			return (
				<div className={fieldStyleClass}>
					<div className="eForm_fieldName">{this.props.children}
						<span className={errorClassName}>{this.getErrorText()}</span>
					</div>
					<div className={classNames("eForm_fieldSet", this.props.fieldClassName)}>
						{inputField}
						<div className={errorIconClass} title={binding.get('error') || ''} dangerouslySetInnerHTML={html} />
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