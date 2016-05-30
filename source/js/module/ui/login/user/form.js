const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		React 		= require('react'),
        Auth        = require('module/core/services/AuthorizationServices');

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

		let subdomains = document.location.host.split('.');
		subdomains[0] = "password";
		const domain = subdomains.join(".");

		self.forgotPassUrl = `http://${domain}/#reset-request`;
	},

	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<div>
			<Form name={self.tmpFormName} service={Auth.login} binding={self.getDefaultBinding()} onSuccess={self.props.onSuccess} onError={self.props.onError}>
				<FormField type="text" placeholder="E-mail" htmlId="login_input" field="email" validation="email required" />
				<FormField type="text" textType="password" placeholder="Password" htmlId="password_input" field="password" validation="required" binding={binding}/>
			</Form>
			<a href={self.forgotPassUrl} className="eForgotPass">Forgot password?</a>
			</div>
		)
	}
});


module.exports = LoginUserForm;
