var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	RegiseterUserForm;

RegiseterUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	onSuccess: function() {
		var self = this;

		self.showForm = false;
	},
	render: function() {
		var self = this;

		return (
			<Form name="Sing up" service="users" binding={self.getDefaultBinding()} onSuccess={self.props.onSuccess}>
				<FormField type="text" field="username" validation="alphanumeric server">Username</FormField>
				<FormField type="text" field="firstName" validation="required alphanumeric">First name</FormField>
				<FormField type="text" field="lastName" validation="required alphanumeric">Last name</FormField>
				<FormField type="text" field="email" validation="required confirm email server">Email</FormField>
				<FormField type="text" field="password" validation="required confirm">Password</FormField>
			</Form>
		)
	}
});


module.exports = RegiseterUserForm;
