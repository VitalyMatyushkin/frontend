const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		Morearty    = require('morearty'),
		React 		= require('react');

/** First registration step where user input email, password, firstname and lastname */
const RegisterUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'AccountForm',
	propTypes: {
		onSuccess: React.PropTypes.func,
        onError: React.PropTypes.func
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<Form updateBinding={true} service="i/register" binding={binding} onSuccess={this.props.onSuccess}
						onError={this.props.onError}>
				{/*@errorClassName prop: Provide a defined scss class to control how error message is displayed without having to change the current style*/}
				<FormField type="text" field="firstName" validation="required text" id="register_firstName">Name</FormField>
				<FormField type="text" field="lastName" validation="required text" id="register_lastName">Surname</FormField>
				<FormField type="text" field="email" validation="required email server" errorClassName="eForm_errorMsgRight" id="register_email">Email</FormField>
				<FormField type="phone" field="phone" validation="required phone server" errorClassName="eForm_errorMsgRight" id="register_phone">Mobile phone</FormField>
				<FormField type="confirmText" textType="password" field="password" validation="required password" id="register_password">Password</FormField>

				<div className="eRegisterMessage">Having trouble signing up? <a
						href="mailto:support@squadintouch.com?subject=Registration">Email
					us</a></div>
				<FormField type="terms" field="terms" validation="termsAndConditions"/>

			</Form>
		)
	}
});


module.exports = RegisterUserForm;
