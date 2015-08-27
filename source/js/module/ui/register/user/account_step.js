var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	RegiseterUserForm;

RegiseterUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'AccountForm',
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	getPhone(phone) {
		return '7' + phone.replace('(', '').replace(')', '').replace('-', '');
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Form name="Account Setup" updateBinding={true} service="users" binding={binding} onSuccess={self.props.onSuccess}>
				<FormField type="text" field="username" validation="alphanumeric server">Username</FormField>
				<FormField type="text" field="email" validation="required email server">Email</FormField>
				<FormField type="phone" field="phone" validation="phone" onPrePost={self.getPhone}>Mobile phone</FormField>
				<FormField type="confirmText" textType="password" field="password" validation="required">Password</FormField>
			</Form>
		)
	}
});


module.exports = RegiseterUserForm;