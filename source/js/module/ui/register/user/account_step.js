const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column'),
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
				<FormField type="text" field="username" validation="alphanumeric server">Username</FormField>
				<FormField type="text" field="email" validation="required email server">Email</FormField>
				<FormField type="text" field="phone" validation="required server" onPrePost={self.getPhone}>Mobile phone</FormField>
				<FormField type="confirmText" textType="password" field="password" validation="required password">Password</FormField>
				<FormColumn type="column">
					<FormField type="terms" field="terms" validation="termsAndConditions">Terms and Conditions:</FormField>
				</FormColumn>
			</Form>
		)
	}
});


module.exports = RegiseterUserForm;
