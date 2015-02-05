var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	RegiseterUserForm;

RegiseterUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<Form name="Sing up" service="users" binding={self.getDefaultBinding()}>
				<FormField type="text" field="username" validation="required alphanumeric server">Username</FormField>
				<FormField type="text" field="email" validation="required confirm email server">Email</FormField>
				<FormField type="text" field="password" validation="required confirm">Password</FormField>
			</Form>
		)
	}
});


module.exports = RegiseterUserForm;
