import * as React from 'react';
import * as Morearty from 'morearty';
import * as propz from 'propz';
import * as Immutable from 'immutable';
import * as SessionHelper from 'module/helpers/session_helper';
import * as Verification from 'module/ui/register/user/verification_step';

export const VerificationStep = (React as any).createClass({
	mixins: [Morearty.Mixin],
	handleClickConfirmEmail: function (emailCode): void {
		const   binding             = this.getDefaultBinding(),
				verificationBinding = SessionHelper.getLoginSessionBinding( this.getUserDataBinding() ).sub('verified');

		binding.set('isSync', false);

		// (window as any).Server.confirmUser.post( {token: emailCode} ).then(data => {
		// 	if(data.confirmed) {
		// 		verificationBinding.set('email',        Immutable.fromJS(true));
		// 		binding.atomically()
		// 			.set('isSync',                      true)
		// 			.set('isErrorEmailVerification',    false)
		// 			.commit();
		//
		// 		verificationBinding.toJS('sms') && this.props.setStep();
		// 	} else {
		// 		binding.set('isErrorEmailVerification', true);
		// 	}
		// }).catch(() => {
		// 	binding.set('isErrorEmailVerification', true);
		// });
	},
	handleClickConfirmPhone: function (phoneCode: string): void {
		const   binding             = this.getDefaultBinding(),
				verificationBinding = SessionHelper.getLoginSessionBinding( this.getUserDataBinding() ).sub('verified');

		binding.set('isSync', false);

		// (window as any).Server.confirmUserPhone.post( {token: phoneCode} ).then(data => {
		// 	if(data.confirmed) {
		// 		verificationBinding.set('sms', true);
		// 		binding.atomically()
		// 			.set('isSync',                      true)
		// 			.set('isErrorPhoneVerification',    false)
		// 			.commit();
		//
		// 		verificationBinding.toJS('email') && this.props.setStep();
		// 	} else {
		// 		binding.set('isErrorPhoneVerification', true);
		// 	}
		// }).catch(() => {
		// 	binding.set('isErrorPhoneVerification', true);
		// });
	},
	handleClickResendEmail: function(): void {
		const binding = this.getDefaultBinding();

		(window as any).Server.profileEmailResend.post()
			.then(data => {
				const interval = new Date(data.nextResendAt).getTime() - new Date().getTime();
				binding.atomically()
					.set('canUserResendEmailVerification',  false)
					.set('isResentEmailPopupOpen',          !this.isResentEmailPopupOpen())
					.commit();
				setTimeout(() => {binding.set('canUserResendEmailVerification', true)}, interval);
			});
	},
	handleSuccessEmailChange: function(newEmail: string): void {
		const loginSessionBinding    = SessionHelper.getLoginSessionBinding( this.getUserDataBinding() );

		loginSessionBinding.set('email', Immutable.fromJS(newEmail));
		this.forceUpdate();
	},
	handleClickResendPhone: function(): void {
		const binding = this.getDefaultBinding();

		(window as any).Server.profilePhoneResend.post()
			.then(data => {
				const interval = new Date(data.nextResendAt).getTime() - new Date().getTime();
				binding.atomically()
					.set('canUserResendPhoneVerification',  false)
					.set('isResentPhonePopupOpen',          !this.isResentPhonePopupOpen())
					.commit();
				setTimeout(() => {binding.set('canUserResendEmailVerification', true)}, interval);
			});
	},
	handleSuccessPhoneChange: function(newPhone: string): void {
		const loginSessionBinding    = SessionHelper.getLoginSessionBinding(this.getUserDataBinding());

		loginSessionBinding.set('phone', Immutable.fromJS(newPhone));
		this.forceUpdate();
	},
	getUserDataBinding: function () {
		return this.getMoreartyContext().getBinding().sub('userData');
	},
	getEmail: function(): void {
		const loginSessionBinding = SessionHelper.getLoginSession(
			this.getUserDataBinding()
		);

		return propz.get(loginSessionBinding, ['email'], undefined);
	},
	getPhone: function() {
		const loginSessionBinding = SessionHelper.getLoginSession(
			this.getUserDataBinding()
		);

		return propz.get(loginSessionBinding, ['phone'], undefined);
	},

	isEmailVerified: function() {
		const loginSessionBinding = SessionHelper.getLoginSession(
			this.getUserDataBinding()
		);

		return propz.get(loginSessionBinding, ['verified', 'email'], undefined);
	},
	isPhoneVerified: function() {
		const loginSessionBinding = SessionHelper.getLoginSession(
			this.getUserDataBinding()
		);

		return propz.get(loginSessionBinding, ['verified', 'sms'], undefined);
	},

	isErrorEmailVerification: function() {
		return this.getDefaultBinding().toJS('isErrorEmailVerification');
	},
	isErrorPhoneVerification: function() {
		return this.getDefaultBinding().toJS('isErrorPhoneVerification');
	},

	canUserResendEmailVerification: function() {
		return this.getDefaultBinding().toJS('canUserResendEmailVerification');
	},
	canUserResendPhoneVerification: function() {
		return this.getDefaultBinding().toJS('canUserResendPhoneVerification');
	},
	isResentEmailPopupOpen: function() {
		return this.getDefaultBinding().toJS('isResentEmailPopupOpen');
	},
	handleClickEmailPopupClose: function() {
		return this.getDefaultBinding().set('isResentEmailPopupOpen', !this.isResentEmailPopupOpen());
	},
	isResentPhonePopupOpen: function() {
		return this.getDefaultBinding().toJS('isResentPhonePopupOpen');
	},
	handleClickPhonePopupClose: function() {
		return this.getDefaultBinding().set('isResentPhonePopupOpen', !this.isResentPhonePopupOpen());
	},

	render: function () {
		return(
			<div>
				<Verification
					email                          = { this.getEmail() }
					isEmailVerified                = { this.isEmailVerified() }
					isErrorEmailVerification       = { this.isErrorEmailVerification() }
					phone                          = { this.getPhone() }
					isPhoneVerified                = { this.isPhoneVerified() }
					isErrorPhoneVerification       = { this.isErrorPhoneVerification() }
					handleClickConfirmEmail        = { this.handleClickConfirmEmail }
					handleClickConfirmPhone        = { this.handleClickConfirmPhone }
					handleSuccessEmailChange       = { this.handleSuccessEmailChange }
					handleSuccessPhoneChange       = { this.handleSuccessPhoneChange }
					canUserResendEmailVerification = { this.canUserResendEmailVerification() }
					canUserResendPhoneVerification = { this.canUserResendPhoneVerification() }
					handleClickResendEmail         = { this.handleClickResendEmail }
					handleClickResendPhone         = { this.handleClickResendPhone }
					isResentEmailPopupOpen         = { this.isResentEmailPopupOpen() }
					handleClickEmailPopupClose     = { this.handleClickEmailPopupClose }
					isResentPhonePopupOpen         = { this.isResentPhonePopupOpen() }
					handleClickPhonePopupClose     = { this.handleClickPhonePopupClose }
				/>
				<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
				<button className="bButton" onClick={() => this.props.setStep()}>Continue</button>
			</div>
		);
	}
});