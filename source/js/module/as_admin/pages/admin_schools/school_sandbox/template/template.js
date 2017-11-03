/**
 * Created by Woland on 29.10.2017.
 */
const 	React 										= require('react'),
		Morearty 									= require('morearty'),
		Immutable 									= require('immutable'),
	
		Form 										= require('module/ui/form/form'),
		FormField 									= require('module/ui/form/form_field'),
		FormBlock 									= require('module/ui/form/form_block/form_block'),
		FormElementManager 							= require('module/ui/form/form_element_manager'),
	
		Loader 										= require('module/ui/loader'),
			
		CONSENT_REQUEST_TEMPLATE_FIELD_TYPE 		= require('module/helpers/consts/schools').CONSENT_REQUEST_TEMPLATE_FIELD_TYPE,
		CONSENT_REQUEST_TEMPLATE_FIELD_TYPE_ARRAY 	= require('module/helpers/consts/schools').CONSENT_REQUEST_TEMPLATE_FIELD_TYPE_ARRAY;
	
const ConsentRequestTemplateStyles 					= require('styles/pages/schools/b_consent_request_template.scss');

const ConsentRequestTemplateComponent = React.createClass({
	mixins:[Morearty.Mixin],
	componentWillMount: function(){
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				schoolId 		= globalBinding.get('routing.pathParameters.0');
		
		const formBinding		= binding.sub('formData');

		window.Server.consentRequestTemplate.get(schoolId).then(template => {
			if (template.fields.length === 0) {
				//for empty template we display one field block
				binding.atomically()
				.set('consentRequestTemplateCountFields', 1)
				.set('isSync', true)
				.commit();
			} else {
				const formData = this.getFieldsConverted(template.fields);
				binding.atomically()
				.set('consentRequestTemplateCountFields', template.fields.length)
				.set('isSync', true)
				.commit();
				formBinding.set(Immutable.fromJS(formData));
			}
		});
	},
	componentWillUnmount: function() {
		const binding = this.getDefaultBinding();
		binding.sub('formData').clear();
		binding.set('isSync', false);
	},
	//Return converted fields for display it in form component
	//ex. heading_0, type_0, isRequired_0, enumOptions_0
	getFieldsConverted: function(fields){
		const formData = {};
		fields.forEach((field, index) => {
			delete field._id; //unused property, change server reviver?
			for(let key in field){
				const value = field[key];
				if(typeof value !== 'undefined') {
					//cast array into string
					if (Array.isArray(value)) {
						formData[`${key}_${index}`] = value.join(', ');
					} else {
						formData[`${key}_${index}`] = value;
					}
				}
			}
		});
		
		return formData;
	},
	onClickFormElementManager: function(){
		const binding = this.getDefaultBinding();
		
		binding.update('consentRequestTemplateCountFields', consentRequestTemplateCountFields => consentRequestTemplateCountFields + 1);
	},
	onClickFormBlockHeader: function(index){
		const binding = this.getDefaultBinding();
		binding.update('consentRequestTemplateCountFields', consentRequestTemplateCountFields => consentRequestTemplateCountFields - 1);
		this.clearConsentRequestTemplateFieldsByIndex(index);
	},
	clearConsentRequestTemplateFieldsByIndex: function(index){
		const binding = this.getDefaultBinding().sub('formData');
		
		const fieldData = {
			active:	true,
			error:	false,
			value:	''
		};
		
		binding.meta()
		.atomically()
		.set(`heading_${index}`,		Immutable.fromJS(fieldData))
		.set(`isRequired_${index}`,		Immutable.fromJS(fieldData))
		.set(`type_${index}`,			Immutable.fromJS(fieldData))
		.set(`enumOptions_${index}`,	Immutable.fromJS(fieldData))
		.commit();
		
		this.forceUpdate();
	},
	renderFormField: function(){
		const 	binding 		= this.getDefaultBinding(),
				countFields 	= binding.toJS('consentRequestTemplateCountFields'),
				formBinding		= binding.sub('formData');

		const fields = [];
		
		for (let index = 0; index < countFields; index++) {
			fields.push(
				<FormBlock
					customStyle 		= 'bConsentRequestTemplateFormBlock'
					key 				= { `consentRequestTemplate-${index}` }
					onClickClose 		= { () => this.onClickFormBlockHeader(index) }
					isShowCloseButton 	= { index !== 0 } //for first element we don't show close button
				>
					<FormField
						type 	= "text"
						field 	= {`heading_${index}`}
					>
						Heading
					</FormField>
					<FormField
						type 	= "checkbox"
						field 	= {`isRequired_${index}`}
					>
						Is required
					</FormField>
					<FormField
						type 	= "dropdown"
						field 	= {`type_${index}`}
						options = { CONSENT_REQUEST_TEMPLATE_FIELD_TYPE_ARRAY }
					>
						Type
					</FormField>
					<FormField
						type 		= "text"
						field 		= {`enumOptions_${index}`}
						isDisabled 	= { formBinding.meta(`type_${index}.value`).toJS() !== CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.ENUM }
						validation 	= { 'alphanumericAndComma' }
					>
						Options, separated by commas (only for enum)
					</FormField>
				</FormBlock>
			);
		}
		
		return (
			fields
		);
	},
	/**
	 * Function return array of enum options from sting (use comma as separator)
	 */
	getEnumOptions: function(enumString){
		return enumString.split(',').map(elem => elem.trim())
	},
	onClickFormSubmit: function(){
		const 	binding 		= this.getDefaultBinding(),
				countFields 	= binding.toJS('consentRequestTemplateCountFields'),
				formBinding 	= this.getDefaultBinding().sub('formData'),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				schoolId 		= globalBinding.get('routing.pathParameters.0');
			
		binding.set('isSync', false);
		
		//data to transfer
		const data = {
			fields: []
		};
		
		for (let index = 0; index < countFields; index++) {
			//we cast undefined into default value
			const type = typeof formBinding.meta(`type_${index}.value`).toJS() === 'undefined' ? CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.STRING : formBinding.meta(`type_${index}.value`).toJS();
			
			if (formBinding.meta(`type_${index}.value`).toJS() === CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.ENUM) {
				//we cast string into array
				const enumOptions = this.getEnumOptions(formBinding.meta(`enumOptions_${index}.value`).toJS());

				data.fields.push({
					heading: 		formBinding.meta(`heading_${index}.value`).toJS(),
					isRequired: 	Boolean(formBinding.meta(`isRequired_${index}.value`).toJS()),
					type: 			type,
					enumOptions: 	enumOptions
				});
			} else {
				data.fields.push({
					heading: 		formBinding.meta(`heading_${index}.value`).toJS(),
					isRequired: 	Boolean(formBinding.meta(`isRequired_${index}.value`).toJS()),
					type: 			type
				});
			}
		}
		
		window.Server.consentRequestTemplate.put(schoolId, data).then(template => {
			const formData = this.getFieldsConverted(template.fields);
			binding.atomically()
				.set('consentRequestTemplateCountFields', template.fields.length)
				.set('isSync', true)
				.commit();
			formBinding.set(Immutable.fromJS(formData));
			window.simpleAlert(
				'The template have been updated successfully!',
				'Ok',
				() => {}
			)
		 });
	},
	render: function(){
		const 	binding 	= this.getDefaultBinding(),
				isSync 		= Boolean(binding.toJS('isSync'));
		if (isSync) {
			return (
				<Form
					name		= "Consent Request Template"
					binding		= { binding.sub('formData') }
					onSubmit	= { this.onClickFormSubmit }
				>
					{this.renderFormField()}
					<FormElementManager
						isVisible 		= { true }
						text 			= { 'Add fields' }
						onClick 		= { this.onClickFormElementManager }
					/>
				</Form>
			);
		} else {
			return (
				<Loader
					condition = {true}
				/>
			);
		}
	}
});

module.exports = ConsentRequestTemplateComponent;