const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		If			= require('module/ui/if/if'),
		React 		= require('react'),
		Morearty    = require('morearty'),
        Auth        = require('module/core/services/AuthorizationServices'),
		bFormStyles	= require('../../../../../styles/ui/forms/b_form.scss');

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
		self.forgotPassUrl = `//${domain}/#reset-request`;
	},

	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<div className="bLoginForm">
				<Form	name				= {self.tmpFormName}
						service				= {Auth.login}
						binding				= {self.getDefaultBinding()}
						onSuccess			= {self.props.onSuccess}
						onError				= {self.props.onError}
						hideCancelButton	= {true}
						submitButtonId		= 'login_submit'
				>
					<FormField classNames="mWithoutPadding" type="text" textType="email" placeholder="E-mail" field="email" validation="email required" id="login_email"/>
					<FormField classNames="mPaddingBottomOnly" type="text" textType="password" placeholder="Password" field="password" validation="required" binding={binding} id="login_password"/>
				</Form>
				<If condition={self.props.customName === 'default'}>
					<a href={self.forgotPassUrl} className="eForgotPass">Forgot password?</a>
				</If>
			</div>
		)
	}
});


module.exports = LoginUserForm;
