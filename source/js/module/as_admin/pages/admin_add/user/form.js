const Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	React = require('react'),

UserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func,
		otherService:React.PropTypes.string
	},
	onSuccess: function() {
		var self = this;
		self.showForm = false;
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();
		return (
			<Form name="Create New User" updateBinding={true} service="users" binding={binding} onSuccess={self.props.onSuccess}>
				<FormField type="text" field="username" validation="alphanumeric server">Username</FormField>
				<FormField type="text" field="firstName" validation="required alphanumeric">First name</FormField>
				<FormField type="text" field="lastName" validation="required alphanumeric">Last name</FormField>
				<FormField type="confirmText" field="email" validation="required email server">Email</FormField>
				<FormField type="confirmText" textType="password" field="password" validation="required">Password</FormField>
			</Form>
		)
	}
});
module.exports = UserForm;
