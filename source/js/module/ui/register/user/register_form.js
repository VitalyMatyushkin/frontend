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
		var self = this,
			binding = self.getDefaultBinding();

		return (
<<<<<<< HEAD:source/js/module/ui/register/user/form_official.js
			<Form name="Joins us as official" service="users" serviceType="managers" binding={self.getDefaultBinding()} onSuccess={self.props.onSuccess}>
=======
			<Form name={"Joins us as " + binding.get('registerType')} updateBinding={true} service="users" binding={binding} onSuccess={self.props.onSuccess}>
>>>>>>> feature/69_1_feature:source/js/module/ui/register/user/register_form.js
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
					<FormField type="phone" field="phone" validation="phone">Mobile phone</FormField>
				</FormColumn>

				<FormColumn type="column">
					<FormField type="text" field="address" validation="alphanumeric">Address</FormField>
				</FormColumn>
<<<<<<< HEAD:source/js/module/ui/register/user/form_official.js
				<FormColumn type="column">
					<FormField defaultValueString="Official" type="text" field="registrationType" validation="required">Registration Type</FormField>
				</FormColumn>
=======

				<FormField type="hidden" field="registerType" validation="alphanumeric"></FormField>
>>>>>>> feature/69_1_feature:source/js/module/ui/register/user/register_form.js
			</Form>
		)
	}
});


module.exports = RegiseterUserForm;
