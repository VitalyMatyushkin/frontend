const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		Promise 	= require('bluebird'),
		Morearty    = require('morearty'),
		React 		= require('react');

const UserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func,
		otherService:React.PropTypes.string
	},
	onSuccess: function(data) {
		this.showForm = false;
	},
	getGender: function() {
		const gendersArray = [
				{
					value: 'Male',
					id: 'MALE'
				},
				{
					value: 'Female',
					id: 'FEMALE'
				}
			];

		return Promise.resolve(gendersArray);
	},


	render: function() {
		const binding = this.getDefaultBinding();
		return (
			<Form name="Create New User" updateBinding={true} service="superadmin/users" binding={binding} onSuccess={this.props.onSuccess}>
				<FormField type="text" field="firstName" validation="required alphanumeric">First name</FormField>
				<FormField type="text" field="lastName" validation="required alphanumeric">Last name</FormField>
				<FormField type="radio" field="gender"  sourcePromise={this.getGender} validation="required">Gender</FormField>
                <FormField type="phone" field="phone" validation="required phone server">Phone</FormField>
				<FormField type="confirmText" field="email" validation="required email server" >Email</FormField>
				<FormField type="confirmText" textType="password" field="password" validation="required">Password</FormField>
			</Form>
		)
	}
});
module.exports = UserForm;
