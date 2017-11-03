/**
 * Created by Woland on 30.10.2017.
 */
const 	React = require('react'),
		Field = require('./field');

const MESSAGE_TYPE = require('module/ui/message_list/message/const/message_consts').MESSAGE_TYPE;

const SchoolConst = require('module/helpers/consts/schools');

const ConsentRequestTemplateComponentStyles = require('styles/ui/b_consent_request_template/b_consent_request_template.scss');

let accumulator = []; // used for accumulation initial value of fields

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
			templateData: []
		}
	},
	getDefaultValue: function(field){
		switch(field.type){
			case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.STRING:
				return '';
			case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.NUMBER:
				return '';
			case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.BOOLEAN:
				return false;
			case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.ENUM:
				return field.enumOptions[0];
		}
	},
	onChange: function(fieldData, isInitial, index){
		if (isInitial) {
			accumulator[index] = fieldData;
			this.setState({
				templateData: this.state.templateData.concat(accumulator)
			});
			this.props.onChange(accumulator);
		} else {
			const Array = this.state.templateData.slice();
			Array[index] = fieldData;

			this.setState({
				templateData: Array
			});
			this.props.onChange(Array);
		}
	},
	renderField: function(fields){
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
					defaultValue 	= { this.getDefaultValue(field) }
					onChange 		= { (fieldData, isInitial) => {this.onChange(fieldData, isInitial, index)} }
					addErrorClass 	= { addErrorClass }
				/>
			);
		})
	},
	
	renderFieldFilled: function(fields){
		return fields.map( (field, index) => {
			return (
				<p key={`field_${index}`}><span className="mBold">{field.heading}</span> {String(field.value)}</p>
			);
		})
	},
	
	render: function(){
		const 	template 	= this.props.template,
				message 	= this.props.message,
				type 		= this.props.type;
		
		switch(true){
			case (type === MESSAGE_TYPE.ARCHIVE && Array.isArray(message.fields) && message.fields.length > 0):
				return (
					<div className="bConsentRequestTemplate">
						{this.renderFieldFilled(message.fields)}
					</div>
				);
			case (type === MESSAGE_TYPE.INBOX && Array.isArray(template.fields) && template.fields.length > 0):
				return (
					<div className="bConsentRequestTemplate">
						{this.renderField(template.fields)}
					</div>
				);
			default: return null;
		}
	}
});

module.exports = ConsentRequestTemplateComponent;