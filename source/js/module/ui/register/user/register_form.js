const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column'),
		React 		= require('react'),
		Morearty    = require('morearty');

const RegiseterUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Form name={"Joins us as " + binding.get('registerType')} updateBinding={true} service="users" binding={binding} onSuccess={self.props.onSuccess}>
				<FormField type="text" field="username" validation="alphanumeric server">Username</FormField>

				<FormColumn>
					<FormField type="text" field="firstName" validation="required alphanumeric">First name</FormField>
				</FormColumn>

				<FormColumn>
					<FormField type="text" field="lastName" validation="required alphanumeric">Last name</FormField>
				</FormColumn>

				<FormField type="confirmText" field="email" validation="required email server">Email</FormField>
				<FormField type="confirmText" textType="password" field="password" validation="required">Password</FormField>

				<FormColumn>
					<FormField type="phone" field="phone" validation="phone">Mobile phone</FormField>
				</FormColumn>

				<FormColumn>
					<FormField type="text" field="address" validation="alphanumeric">Address</FormField>
				</FormColumn>

				<FormField type="hidden" field="registerType" validation="alphanumeric"></FormField>
			</Form>
		)
	}
});


module.exports = RegiseterUserForm;
