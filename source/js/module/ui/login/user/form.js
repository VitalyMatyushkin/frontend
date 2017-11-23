const	Form				= require('module/ui/form/form'),
		FormField 			= require('module/ui/form/form_field'),
	{If}				= require('module/ui/if/if'),
		React				= require('react'),
		Morearty			= require('morearty'),
		Auth				= require('module/core/services/AuthorizationServices'),
		RememberMeCheckbox	= require('module/ui/login/user/form_components/remember_me_checkbox'),
		bFormStyles			= require('../../../../../styles/ui/forms/b_form.scss');

const LoginUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onChangeRememberMe:	React.PropTypes.func.isRequired,
		onSuccess:			React.PropTypes.func.isRequired,
		onError:			React.PropTypes.func.isRequired,
		customName:			React.PropTypes.string
	},
	componentWillMount:function(){
		const subdomains 	= document.location.host.split('.');

		subdomains[0] = "password";
		const domain = subdomains.join(".");

		this.tmpFormName = this.props.customName === 'default' ? "Sign in or <a class='mHover' href='/#register'>join us for free</a>" : this.props.customName;
		this.forgotPassUrl = `//${domain}/#reset-request`;
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<div className="bLoginForm">
				<Form	name				= {this.tmpFormName}
						service				= {Auth.login}
						binding				= {this.getDefaultBinding().sub('form')}
						onSuccess			= {this.props.onSuccess}
						onError				= {this.props.onError}
						hideCancelButton	= {true}
						submitButtonId		= 'login_submit'
				>
					<FormField
						classNames="mWithoutPadding"
						type="text"
						textType="email"
						placeholder="E-mail"
						field="email"
						validation="email required"
						id="login_email"
					/>
					<FormField
						classNames="mPaddingBottomOnly"
						type="text"
						textType="password"
						placeholder="Password"
						field="password"
						validation="required"
						binding={binding}
						id="login_password"
					/>
					<RememberMeCheckbox
						isChecked	= { binding.toJS('isRememberMe') }
						onChange	= { this.props.onChangeRememberMe }
					/>
				</Form>
				<If condition={this.props.customName === 'default'}>
					<a href={this.forgotPassUrl} className="eForgotPass">Forgot password?</a>
				</If>
			</div>
		)
	}
});

module.exports = LoginUserForm;