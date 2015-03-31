var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	RegiseterUserForm;

RegiseterUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func,
		onError: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return (
			<Form name="Sing in or <a class='mHover' href='/#register'>sing up for free</a>" service="users/login" binding={self.getDefaultBinding()} onSuccess={self.props.onSuccess} onError={self.props.onError}>
				<FormField type="text" field="username" validation="required">Username or email</FormField>
				<FormField type="text" textType="password" field="password" validation="required">Password</FormField>
			</Form>
		)
	}
});


module.exports = RegiseterUserForm;
