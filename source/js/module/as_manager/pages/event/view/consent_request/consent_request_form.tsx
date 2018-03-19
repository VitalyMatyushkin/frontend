import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as Form from 'module/ui/form/form';
import * as FormField from 'module/ui/form/form_field';

export const ConsentRequestForm = (React as any).createClass({
	mixins: [Morearty.Mixin],

	propTypes: {
		onCancel: (React as any).PropTypes.func.isRequired,
		onSubmit: (React as any).PropTypes.func.isRequired,
		consentFields: (React as any).PropTypes.array.isRequired
	},

	componentWillMount: function () {
		const formData = this.getFieldsConverted(this.props.consentFields);
		this.getDefaultBinding().sub('formConsentData').set(Immutable.fromJS(formData));
	},

	getFieldsConverted: function(fields){
		const formData = {};
		fields.forEach((field, index) => {
			formData[`isDefault_${index}`] = field['isDefault'];
		});

		return formData;
	},

	renderField: function () {
		return (
			this.props.consentFields.map((field, index) => {
				return (
					<FormField
						key         = {`isDefault_${index}`}
						type 		= "checkbox"
						classNames	= "bCheckboxConsentRequest"
						field 		= {`isDefault_${index}`}
					>
						{field.heading}
					</FormField>
				);
			})
		);
	},

	onClickSubmit: function (data) {
		const newConsentFields = this.props.consentFields.map((field, index) => {
			field.isDefault = data[`isDefault_${index}`];
			return field;
		});
		this.props.onSubmit(newConsentFields);
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<Form
				name		    = "Parental consent questions list"
				binding         = { binding.sub('formConsentData') }
				onSubmit        = { this.onClickSubmit }
				onCancel        = { () => { this.props.onCancel() } }
				defaultButton   = "Ok"
			>
				{ this.renderField() }
			</Form>
		);
	}
});