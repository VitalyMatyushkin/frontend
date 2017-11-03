/**
 * Created by Woland on 30.10.2017.
 */
const 	React 		= require('react'),
		classNames  = require('classnames');

const 	TextInput 	= require('module/ui/text_input'),
		Checkbox 	= require('module/ui/checkbox/checkbox'),
		Select 		= require('module/ui/select-react/select');

const SchoolConst 	= require('module/helpers/consts/schools');

const ConsentRequestTemplateFieldComponentStyles = require('styles/ui/b_consent_request_template/b_consent_request_template.scss');

const ConsentRequestTemplateFieldComponent = React.createClass({
	propTypes: {
		field: 			React.PropTypes.shape({
			heading: 			React.PropTypes.string,
			type: 				React.PropTypes.oneOf(SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE_ARRAY_OF_STRING),
			isRequired: 		React.PropTypes.bool,
			enumOptions: 		React.PropTypes.arrayOf(React.PropTypes.string),
			value: 				React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.bool])
		}).isRequired,
		onChange: 		React.PropTypes.func.isRequired,
		defaultValue: 	React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]).isRequired,
		addErrorClass: 	React.PropTypes.bool.isRequired
	},
	getInitialState: function(){
		return {
			value: this.props.defaultValue
		}
	},
	componentWillMount: function(){
		const fieldInitialData = Object.assign({}, this.props.field, { value: this.props.defaultValue });
		this.props.onChange(fieldInitialData, true);
	},

	onChange: function(value){
		const fieldData = Object.assign({}, this.props.field, { value: value });
		
		this.props.onChange(fieldData, false);
		this.setState({
			value: value
		});

	},
	renderBody: function(){
		const field = this.props.field;
		
		switch(field.type){
			case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.STRING:
				return (
					<TextInput
						handleChange 	= { this.onChange }
						isRequired 		= { field.isRequired }
						customStyle 	= {'mFullWidth'}
					/>
				);
			case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.NUMBER:
				return (
					<TextInput
						handleChange 	= { this.onChange }
						isRequired 		= { field.isRequired }
						customStyle 	= {'mFullWidth'}
					/>
				);
			case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.BOOLEAN:
				return (
					<Checkbox
						isChecked				= { this.state.value }
						onChange				= { this.onChange }
						isReturnEventTarget 	= { false }
					/>
				);
			case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.ENUM:
				return (
					<Select
						optionsArray 	= { field.enumOptions }
						currentOption 	= { this.state.value === '' ? field.enumOptions[0] : this.state.value }
						handleChange 	= { this.onChange }
					/>
				);
		}
	},
	render: function(){
		const 	field 			= this.props.field,
				addErrorClass 	= this.props.addErrorClass,
				classes 		= classNames({
					eConsentRequestTemplateWrapper:	true,
					mError: 						addErrorClass
				});
		
		return (
			<div className={classes}>
				<div className="eConsentRequestTemplateHeading">
					{field.isRequired ? field.heading + ' (required)' : field.heading}
					</div>
				{this.renderBody()}
			</div>
		);
	}
});

module.exports = ConsentRequestTemplateFieldComponent;