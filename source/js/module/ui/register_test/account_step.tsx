import * as Form from 'module/ui/form/form';
import * as FormField from 'module/ui/form/form_field';
import * as Morearty from 'morearty';
import * as React from 'react';

export const AccountForm = (React as any).createClass({
	mixins: [Morearty.Mixin],
	render: function () {
		const binding = this.getDefaultBinding();

		return (
			<Form
				binding         = {binding}
				onSubmit        = {this.props.onSubmit}
				onCancel        = {this.props.handleClickBack}
				rejectButtonText= 'Back'
			>
				<FormField type="text" field="firstName" validation="required text">Name</FormField>
				<FormField type="text" field="lastName" validation="required text">Surname</FormField>
				<FormField type="text" field="email" validation="required email server" errorClassName="eForm_errorMsgRight">Email</FormField>
				<FormField type="phone" field="phone" validation="required phone server" errorClassName="eForm_errorMsgRight">Mobile phone</FormField>
				<FormField type="confirmText" textType="password" field="password" validation="required password">Password</FormField>

				<div className="eRegisterMessage">
					Having trouble signing up?
					<a href="mailto:support@squadintouch.com?subject=Registration">Emailus</a>
				</div>
				<FormField type="terms" field="terms" validation="termsAndConditions"/>
			</Form>
		)
	}
});