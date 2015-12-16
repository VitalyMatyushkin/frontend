var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	LoginUserForm;

LoginUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func,
		onError: React.PropTypes.func,
		customName: React.PropTypes.string
	},
	componentWillMount:function(){
		var self = this,
			binding = self.getDefaultBinding();
		self.tmpFormName = self.props.customName === 'default'? self.props.customName = "Sign in or <a class='mHover' href='/#register'>join us for free</a>" : self.props.customName;
	},

	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Form derName="DerLoginForm" name={self.tmpFormName} service={window.Server.login} binding={self.getDefaultBinding()} onSuccess={self.props.onSuccess} onError={self.props.onError}>
				<FormField type="text" field="username" validation="required" >Username or email</FormField>
				<FormField type="text" textType="password" field="password" validation="required" binding={binding}>Password</FormField>
			</Form>
		)
	}
});


module.exports = LoginUserForm;
