var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	RegiseterUserForm;

RegiseterUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func,
		onError: React.PropTypes.func,
		customName: React.PropTypes.string
	},
	componentWillMount:function(){
		var self = this,
			binding = self.getDefaultBinding();
		typeof self.props.customName === 'undefined'? self.props.customName = "Sign in or <a class='mHover' href='/#register'>join us for free</a>" : self.props.customName;
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Form name={self.props.customName} service="users/login" binding={self.getDefaultBinding()} onSuccess={self.props.onSuccess} onError={self.props.onError}>
				<FormField type="text" field="username" validation="required">Username or email</FormField>
				<FormField type="text" textType="password" field="password" validation="required">Password</FormField>
			</Form>
		)
	}
});


module.exports = RegiseterUserForm;
