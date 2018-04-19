import * as React from 'react';
import * as Morearty from 'morearty';
import * as Form from 'module/ui/form/form';
import * as FormField from 'module/ui/form/form_field';
import {STATUS} from './status_helper';

export const StripeIntegrationForm = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: (React as any).PropTypes.string.isRequired,
		onClickSubmit: (React as any).PropTypes.func.isRequired
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<Form
				name		    = { this.props.title }
				binding         = { binding }
				onSubmit        = { this.props.onClickSubmit }
			>
				<FormField
					type 		= "text"
					field 		= "name"
					validation  = "required"
				>
					Name
				</FormField>
				<FormField
					type 		= "text"
					field 		= "key"
					validation  = "required"
				>
					Key
				</FormField>
				<FormField
					type    		= "dropdown"
					field   		= "status"
					options 		= { STATUS }
					defaultValue 	= { STATUS[0].value }
				>
					Status
				</FormField>
			</Form>
		);
	}
});