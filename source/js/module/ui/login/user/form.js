const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		If			= require('module/ui/if/if'),
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
		const 	self 		= this,
				subdomains 	= document.location.host.split('.');

		subdomains[0] = "password";
		const domain = subdomains.join(".");

		self.tmpFormName = self.props.customName === 'default' ? "Sign in or <a class='mHover' href='/#register'>join us for free</a>" : self.props.customName;
		self.forgotPassUrl = `http://${domain}/#reset-request`;
	},

	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<div className="bLoginForm">
				<Form name={self.tmpFormName} service={Auth.login} binding={self.getDefaultBinding()} onSuccess={self.props.onSuccess} onError={self.props.onError}>
					<FormField type="text" placeholder="E-mail" field="email" validation="email required" />
					<FormField type="text" textType="password" placeholder="Password" field="password" validation="required" binding={binding}/>
				</Form>
				<If condition={self.props.customName === 'default'}>
					<a href={self.forgotPassUrl} className="eForgotPass">Forgot password?</a>
				</If>
			</div>
		)
	}
});


module.exports = LoginUserForm;
