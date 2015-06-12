var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	RegiseterUserForm;

RegiseterUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func,
		otherService:React.PropTypes.string
	},
	onSuccess: function() {
		var self = this;

		self.showForm = false;
	},
	_selectChanged:function(){
		console.log('changed');
	},
	render: function() {
		var self = this;

		return (
			<Form name="Sign up" service="users" binding={self.getDefaultBinding()} onSuccess={self.props.onSuccess}>
				<FormField type="text" field="username" validation="alphanumeric server">Username</FormField>
				<FormField type="text" field="firstName" validation="required alphanumeric">First name</FormField>
				<FormField type="text" field="lastName" validation="required alphanumeric">Last name</FormField>
				<FormField type="confirmText" field="email" validation="required email server">Email</FormField>
				<FormField type="confirmText" textType="password" field="password" validation="required">Password</FormField>
				<label>Select role</label>
				<select id="roleSelect" onChange={self._selectChanged.bind(null,self)}>
					<option value="manager">Manager</option>
					<option value="coach">Coach</option>
					<option value="teacher">PE Teacher</option>
					<option value="admin">Admin</option>
				</select>
			</Form>
		)
	}
});
module.exports = RegiseterUserForm;
