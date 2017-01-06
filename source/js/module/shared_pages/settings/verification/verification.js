const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		VerificationStep	= require('./../../../ui/register/user/verification_step');

const Verification = React.createClass({
	mixins: [Morearty.Mixin],

	getEmail: function() {
		return this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.email');
	},
	isErrorEmailVerification: function() {
		return !!this.getDefaultBinding().toJS('isErrorEmailVerification');
	},
	getPhone: function() {
		return this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.phone');
	},
	isErrorPhoneVerification: function() {
		return !!this.getDefaultBinding().toJS('isErrorPhoneVerification');
	},

	canUserResendEmailVerification: function() {
		return !!this.getDefaultBinding().toJS('canUserResendEmailVerification');
	},
	canUserResendPhoneVerification: function() {
		return !!this.getDefaultBinding().toJS('canUserResendPhoneVerification');
	},

	isResentEmailPopupOpen: function() {
		return !!this.getDefaultBinding().toJS('isResentEmailPopupOpen');
	},
	handleClickEmailPopupClose: function() {
		return this.getDefaultBinding().set('isResentEmailPopupOpen', !this.isResentEmailPopupOpen());
	},
	isResentPhonePopupOpen: function() {
		return !!this.getDefaultBinding().toJS('isResentPhonePopupOpen');
	},
	handleClickPhonePopupClose: function() {
		return this.getDefaultBinding().set('isResentPhonePopupOpen', !this.isResentPhonePopupOpen());
	},

	handleClickConfirmEmail: function (emailCode) {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				verificationBinding	= self.getMoreartyContext().getBinding().sub('userData.authorizationInfo.verified');

		binding.set('isSync', false);

		window.Server.confirmUser.post( {token: emailCode} ).then(data => {
			if(data.confirmed) {
				verificationBinding.set('email', true);
				binding.atomically()
					.set('isSync',                      true)
					.set('isErrorEmailVerification',    false)
					.commit();
			} else {
				binding.set('isErrorEmailVerification', true);
			}
		}).catch(() => {
			binding.set('isErrorEmailVerification', true);
		});
	},
	handleClickConfirmPhone: function (phoneCode) {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				verificationBinding	= self.getMoreartyContext().getBinding().sub('userData.authorizationInfo.verified');

		binding.set('isSync', false);

		window.Server.confirmUserPhone.post( {token: phoneCode} ).then(data => {
			if(data.confirmed) {
				verificationBinding.set('sms', true);
				binding.atomically()
					.set('isSync',                      true)
					.set('isErrorPhoneVerification',    false)
					.commit();
			} else {
				binding.set('isErrorPhoneVerification', true);
			}
		}).catch(() => {
			binding.set('isErrorPhoneVerification', true);
		});
	},
	handleClickResendEmail: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		window.Server.profileEmailResend.post()
			.then(data => {
				const interval = new Date(data.nextResendAt).getTime() - new Date().getTime();
				binding.atomically()
					.set('canUserResendEmailVerification',  false)
					.set('isResentEmailPopupOpen',          !this.isResentEmailPopupOpen())
					.commit();
				setTimeout(() => {binding.set('canUserResendEmailVerification', true)}, interval);
			});
	},
	handleSuccessEmailChange: function(newEmail) {
		const	self						= this,
				authorizationInfoBinding	= self.getMoreartyContext().getBinding().sub('userData.authorizationInfo');

		authorizationInfoBinding.set('email', Immutable.fromJS(newEmail));
		this.forceUpdate();
	},
	handleClickResendPhone: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		window.Server.profilePhoneResend.post()
			.then(data => {
				const interval = new Date(data.nextResendAt).getTime() - new Date().getTime();
				binding.atomically()
					.set('canUserResendPhoneVerification',	false)
					.set('isResentPhonePopupOpen',			!this.isResentPhonePopupOpen())
					.commit();
				setTimeout(() => {binding.set('canUserResendEmailVerification', true)}, interval);
			});
	},
	handleSuccessPhoneChange: function(newPhone) {
		const	self						= this,
				authorizationInfoBinding	= self.getMoreartyContext().getBinding().sub('userData.authorizationInfo');

		authorizationInfoBinding.set('phone', Immutable.fromJS(newPhone));
		this.forceUpdate();
	},
	isEmailVerified: function() {
		return !!this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.verified.email');
	},
	isPhoneVerified: function() {
		return !!this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.verified.sms');
	},

	render: function() {
		return (
			<div className="eRegistration_verificationWrapper">
				<VerificationStep	email							= { this.getEmail() }
									isEmailVerified					= { this.isEmailVerified() }
									isErrorEmailVerification		= { this.isErrorEmailVerification() }
									phone							= { this.getPhone() }
									isPhoneVerified					= { this.isPhoneVerified() }
									isErrorPhoneVerification		= { this.isErrorPhoneVerification() }
									handleClickConfirmEmail 		= { this.handleClickConfirmEmail }
									handleClickConfirmPhone 		= { this.handleClickConfirmPhone }
									handleSuccessEmailChange		= { this.handleSuccessEmailChange }
									handleSuccessPhoneChange		= { this.handleSuccessPhoneChange }
									canUserResendEmailVerification	= { this.canUserResendEmailVerification() }
									canUserResendPhoneVerification	= { this.canUserResendPhoneVerification() }
									handleClickResendEmail			= { this.handleClickResendEmail }
									handleClickResendPhone			= { this.handleClickResendPhone }
									isResentEmailPopupOpen			= { this.isResentEmailPopupOpen() }
									handleClickEmailPopupClose		= { this.handleClickEmailPopupClose }
									isResentPhonePopupOpen			= { this.isResentPhonePopupOpen() }
									handleClickPhonePopupClose		= { this.handleClickPhonePopupClose }
				/>
			</div>
		);
	}
});

module.exports = Verification;