var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	RegiseterUserForm;

RegiseterUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'PersonalDetailsForm',
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Form name="Account Setup" updateBinding={true} service="users" binding={binding} onSuccess={self.props.onSuccess}>
				<FormField type="text" field="firstName" validation="alphanumeric">First Name</FormField>
				<FormField type="text" field="lastName" validation="alphanumeric">Last Name</FormField>
				<FormField type="phone" field="phone" validation="phone">Mobile phone</FormField>
				<FormField type="text" field="address" validation="text">Address</FormField>
			</Form>
		)
	}
});


module.exports = RegiseterUserForm;
