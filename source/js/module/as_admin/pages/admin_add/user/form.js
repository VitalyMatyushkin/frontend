const Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	React = require('react'),

UserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func,
		otherService:React.PropTypes.string
	},
	onSuccess: function(data) {
		var self = this;
		self.showForm = false;
	},
	getGender: function() {
		const 	self = this,
			gendersArray = [
				{
					value: 'male',
					id: 'male'
				},
				{
					value: 'female',
					id: 'female'
				}
			];

		return Promise.resolve(gendersArray);
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();
		return (
			<Form name="Create New User" updateBinding={true} service="users" binding={binding} onSuccess={self.props.onSuccess}>
				<FormField type="text" field="username" validation="alphanumeric server" >Username</FormField>
				<FormField type="text" field="firstName" validation="required alphanumeric">First name</FormField>
				<FormField type="text" field="lastName" validation="required alphanumeric">Last name</FormField>
				<FormField type="radio" field="gender"  sourcePromise={self.getGender} validation="required">Gender</FormField>
				<FormField type="confirmText" field="email" validation="required email server" >Email</FormField>
				<FormField type="confirmText" textType="password" field="password" validation="required">Password</FormField>
			</Form>
		)
	}
});
module.exports = UserForm;
