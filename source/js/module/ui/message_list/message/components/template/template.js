/**
 * Created by Woland on 30.10.2017.
 */
const 	React = require('react'),
		propz = require('propz'),
		Field = require('./field');

const MESSAGE_TYPE = require('module/ui/message_list/message/const/message_consts').MESSAGE_TYPE;

const SchoolConst = require('module/helpers/consts/schools');

const ConsentRequestTemplateComponentStyles = require('styles/ui/b_consent_request_template/b_consent_request_template.scss');

const ConsentRequestTemplateComponent = React.createClass({
	propTypes:{
		template: 				React.PropTypes.object.isRequired,
		onChange: 				React.PropTypes.func.isRequired,
		message: 				React.PropTypes.object.isRequired,
		indexFieldWithError: 	React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
		type: 					React.PropTypes.oneOf([MESSAGE_TYPE.INBOX, MESSAGE_TYPE.OUTBOX, MESSAGE_TYPE.ARCHIVE])
	},
	getInitialState: function(){
		return {
			templateData:   []
		}
	},
	getDefaultValue: function(field, index){
		const 	message 	= this.props.message,
				type 		= this.props.type;
		
		if (type === MESSAGE_TYPE.ARCHIVE && Array.isArray(message.fields) && message.fields.length > 0) {
			switch(field.type){
				case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.STRING:
					return propz.get(message, ['fields', index, 'value'], '');
				case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.NUMBER:
					return propz.get(message, ['fields', index, 'value'], '');
				case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.BOOLEAN:
					return propz.get(message, ['fields', index, 'value'], false);
				case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.ENUM:
					return propz.get(message, ['fields', index, 'value'], field.enumOptions[0]);
			}
		} else {
			switch(field.type){
				case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.STRING:
					return '';
				case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.NUMBER:
					return '';
				case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.BOOLEAN:
					if (field.isRequired) {
						return ''
					} else {
						return 'yes';
					}
				case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.ENUM:
					if (field.isRequired && field.enumOptions[0] !== '') {
						field.enumOptions.unshift('');
						return field.enumOptions[0];
					} else {
						return field.enumOptions[0];
					}
			}
		}
	},
	onChange: function(fieldData, isInitial, index){
		if (isInitial) {
			const templateData = this.state.templateData;
			templateData[index] = fieldData;
			this.setState({
				templateData: templateData
			});
			this.props.onChange(templateData);
		} else {
			const Array = this.state.templateData.slice();
			Array[index] = fieldData;
			this.setState({
				templateData: Array
			});
			this.props.onChange(Array);
		}
	},
	renderField: function(fields, isDisabled){
		return fields.map( (field, index) => {
			delete field._id; //unused property, change server reviver?
			
			const indexFieldWithError = this.props.indexFieldWithError;
			let addErrorClass = false;
			if (indexFieldWithError.some(ind => ind === index)) {
				addErrorClass = true;
			}
			
			return (
				<Field
					field 			= { field }
					key 			= { `field_${index}` }
					defaultValue 	= { this.getDefaultValue(field, index) }
					onChange 		= { isDisabled ? () => {} : (fieldData, isInitial) => { this.onChange(fieldData, isInitial, index) } }
					addErrorClass 	= { addErrorClass }
					isDisabled 		= { isDisabled }
				/>
			);
		})
	},
	
	render: function(){
		const 	message 	= this.props.message,
				type 		= this.props.type;
		
		switch(true){
			case (type === MESSAGE_TYPE.ARCHIVE && Array.isArray(message.fields) && message.fields.length > 0):
				return (
					<div className="bConsentRequestTemplate">
						{this.renderField(message.fields, true)}
					</div>
				);
			case (type === MESSAGE_TYPE.INBOX && Array.isArray(message.fields) && message.fields.length > 0):
				return (
					<div className="bConsentRequestTemplate">
						{this.renderField(message.fields, false)}
					</div>
				);
			default: return null;
		}
	}
});

module.exports = ConsentRequestTemplateComponent;