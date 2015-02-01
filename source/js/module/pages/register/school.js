var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	RegisterSchoolForm;

RegisterSchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<Form name="Register school">
				<FormField type="text" validation="alphanumeric">Name</FormField>
				<FormField type="text">School area</FormField>
				<FormField type="text" validation="confirm email">Email</FormField>
				<FormField type="text" validation="confirm">Password</FormField>
			</Form>
		)
	}
});

module.exports = RegisterSchoolForm;
