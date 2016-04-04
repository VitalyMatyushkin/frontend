const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		React 		= require('react');

const LoginUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: 	React.PropTypes.func,
		onError: 	React.PropTypes.func,
		customName: React.PropTypes.string
	},
	componentWillMount:function(){
		const self = this;
		self.tmpFormName = self.props.customName === 'default'? self.props.customName = "Sign in or <a class='mHover' href='/#register'>join us for free</a>" : self.props.customName;
	},

	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<Form name={self.tmpFormName} service={window.Server.superAdminLogin} binding={self.getDefaultBinding()} onSuccess={self.props.onSuccess} onError={self.props.onError}>
				<FormField type="text" placeholder="Username or email" htmlId="login_input" field="email" validation="email required" ></FormField>
				<FormField type="text" textType="password" placeholder="Password" htmlId="password_input" field="password" validation="required" binding={binding}></FormField>
			</Form>
		)
	}
});


module.exports = LoginUserForm;
