import * as React from 'react';
import * as Morearty from 'morearty';
import * as Form from 'module/ui/form/form';
import * as FormField from 'module/ui/form/form_field';

export const ChildStep = (React as any).createClass({
	mixins: [Morearty.Mixin],
	onSubmit: function (data): void {
		this.props.setChild(data);
	},

	render: function() {
		const binding = this.getDefaultBinding();
		return (
			<Form
				binding				= {binding}
				onSubmit			= {this.onSubmit}
				onCancel			= {this.props.handleClickBack}
				rejectButtonText	= 'Back'
			>
				<FormField type="text" field="firstName" validation="required text">Child’s name</FormField>
				<FormField type="text" field="lastName" validation="required text">Child’s surname</FormField>
			</Form>
		);
	}
});