const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		Promise 	= require('bluebird'),
		Morearty    = require('morearty'),
		React 		= require('react');

const UserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		otherService:React.PropTypes.string
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
	_onSubmit:function(data){
		data.countOneTimeIosSessions = data.countOneTimeIosSessions ? Number(data.countOneTimeIosSessions) : undefined;
		data.countOneTimeAndroidSessions = data.countOneTimeAndroidSessions ? Number(data.countOneTimeAndroidSessions) : undefined;
		data.countOneTimeWebSessions = data.countOneTimeWebSessions ? Number(data.countOneTimeWebSessions) : undefined;

		data.verified = {email:true, personal:true, phone:true};

		window.Server.users.post(data)
		.then(() => {document.location.hash = 'users'});
	},
	render: function() {
		const binding = this.getDefaultBinding();
		return (
			<Form name="Create New User" updateBinding={true} service="superadmin/users" onSubmit={this._onSubmit} binding={binding} submitButtonId='createUser_submit' cancelButtonId='createUser_cancel'>
				<FormField type="text" field="firstName" validation="required alphanumeric" id="firstname_input">First name</FormField>
				<FormField type="text" field="lastName" validation="required alphanumeric" id="lastname_input">Last name</FormField>
				<FormField type="radio" field="gender"  sourcePromise={this.getGender} validation="required" id="gender_input">Gender</FormField>
                <FormField type="phone" field="phone" validation="required phone server" id="phone_input">Phone</FormField>
				<FormField type="confirmText" field="email" validation="required email server" id="email_input">Email</FormField>
				<FormField type="confirmText" textType="password" field="password" validation="required" id="password_input">Password</FormField>
				<FormField type="number" field="countOneTimeIosSessions">Count one time iOS sessions</FormField>
				<FormField type="number" field="countOneTimeAndroidSessions">Count one time Android sessions</FormField>
				<FormField type="number" field="countOneTimeWebSessions">Count one time Web sessions</FormField>
			</Form>
		)
	}
});
module.exports = UserForm;
