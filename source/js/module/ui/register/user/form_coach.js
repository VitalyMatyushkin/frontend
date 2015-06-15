var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	RegiseterUserForm;

RegiseterUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return (
			<Form name="Joins us a school as a Coach" service="users" serviceType="coaches" binding={self.getDefaultBinding()} onSuccess={self.props.onSuccess}>
				<FormField type="text" field="username" validation="alphanumeric server">Username</FormField>

				<FormColumn type="column">
					<FormField type="text" field="firstName" validation="required alphanumeric">First name</FormField>
				</FormColumn>

				<FormColumn type="column">
					<FormField type="text" field="lastName" validation="required alphanumeric">Last name</FormField>
				</FormColumn>

				<FormField type="confirmText" field="email" validation="required email server">Email</FormField>
				<FormField type="confirmText" textType="password" field="password" validation="required">Password</FormField>

				<FormColumn type="column">
					<FormField type="text" field="phone" validation="required alphanumeric">Mobile phone</FormField>
				</FormColumn>

				<FormColumn type="column">
					<FormField type="text" field="address" validation="required alphanumeric">Address</FormField>
				</FormColumn>
			</Form>
		)
	}
});


module.exports = RegiseterUserForm;
