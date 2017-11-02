/**
 * Created by Woland on 30.10.2017.
 */
const 	React = require('react'),
		Field = require('./field');

const SchoolConst = require('module/helpers/consts/schools');

const ConsentRequestTemplateComponentStyles = require('styles/ui/b_consent_request_template/b_consent_request_template.scss');

let accumulator = []; // used for accumulation initial value of fields

const ConsentRequestTemplateComponent = React.createClass({
	propTypes:{
		template: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func.isRequired
	},
	getInitialState: function(){
		return {
			templateData: []
		}
	},
	getDefaultValue: function(field){
		switch(field.type){
			case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.STRING || SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.NUMBER:
				return '';
			case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.BOOLEAN:
				return false;
			case SchoolConst.CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.ENUM:
				return field.enumOptions[0];
		}
	},
	onChange: function(fieldData, isInitial, index){
		if (isInitial) {
			accumulator.push(fieldData);
			this.setState({
				templateData: accumulator
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
			return (
				<Field
					field 			= { field }
					key 			= { `field_${index}` }
					defaultValue 	= { this.getDefaultValue(field) }
					onChange 		= { (fieldData, isInitial) => {this.onChange(fieldData, isInitial, index)} }
				/>
			);
		})
	},
	
	render: function(){
		const template = this.props.template;
		
		if (Array.isArray(template.fields) && template.fields.length > 0) {
			return (
				<div className="bConsentRequestTemplate">
					{this.renderField(template.fields)}
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = ConsentRequestTemplateComponent;