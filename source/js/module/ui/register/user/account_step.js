const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		React 		= require('react');

const RegiseterUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'AccountForm',
	propTypes: {
		onSuccess: React.PropTypes.func,
        onError: React.PropTypes.func
	},
	getPhone: function(phone) {
		//return '7' + phone.replace('(', '').replace(')', '').replace('-', '');
		return phone.replace(' ', '').replace('(', '').replace(')', '').replace('-', '');
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		/* phone field have `text` type to be compatable with any phone. Validation was: validation="required phone server" */
		return (
			<Form name="New Account" updateBinding={true} service="users" binding={binding} onSuccess={self.props.onSuccess} onError={self.props.onError}>
				<div className="eForm_field">
					<p>
						Enter your contact details and choose a password you wish to use for logging in to your account.
						We ask you to provide your valid mobile phone number and email address.
					</p>
					<p>
						We'll use your mobile phone number and email address to send you activation codes.
					</p>
					<p>
						You cannot work in the system unless you verify your email address and phone number using these codes.
						You will also use your email address for logging in to the system.
					</p>
				</div>
				{/*@errorClassName prop: Provide a defined scss class to control how error message is displayed without having to change the current style*/}
				<FormField type="text" field="username" validation="required alphanumeric server" errorClassName="eForm_errorMsgRight">Username</FormField>
				<FormField type="text" field="firstName" validation="required text">First Name</FormField>
				<FormField type="text" field="lastName" validation="required text">Last name</FormField>
				<FormField type="text" field="email" validation="required email server" errorClassName="eForm_errorMsgRight">Email</FormField>
				<FormField type="phone" field="phone" validation="required server" errorClassName="eForm_errorMsgRight" onPrePost={self.getPhone}>Mobile phone</FormField>
				<FormField type="confirmText" textType="password" field="password" validation="required password">Password</FormField>
                <FormField type="terms" field="terms" validation="termsAndConditions">Terms and Conditions:</FormField>
			</Form>
		)
	}
});


module.exports = RegiseterUserForm;
