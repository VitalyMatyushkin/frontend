const 	React 		= require('react'),
		propz 		= require('propz'),
		Immutable 	= require('immutable'),
		Morearty	= require('morearty');

const 	PhoneVerification 	= require('module/ui/phone_verification/phone_verification'),
		Loader 				= require('module/ui/loader'),
		If 					= require('module/ui/if/if'),
		Button 				= require('module/ui/button/button');

const UserInvitePageStyles = require('styles/pages/user/b_user_invite.scss');
//const AuthorizationServices = require('module/core/services/AuthorizationServices');

const Application = React.createClass({
	mixins: [Morearty.Mixin],
	componentDidMount(){
		const 	inviteKey 	= document.location.hash.replace('#', ''),
				binding 	= this.getDefaultBinding();

		if (inviteKey !== '' && inviteKey.length === 32) {
			window.Server.invite.post(inviteKey).then(response => {
				const sessionKey = propz.get(response, ['session', 'key']);
				
				binding.atomically()
					.set('inviteData', Immutable.fromJS(response))
					.set('userData.authorizationInfo', Immutable.fromJS({
						id: sessionKey
					}))
					.set('isSync', true)
					.commit();
				
			},
			err => {
				console.error(err.message);
			});
		}
	},
	componentWillUnmount: function(){
		const binding = this.getDefaultBinding();
		
		binding.clear();
	},
	handleClickPhonePopupClose: function(){
		const binding = this.getDefaultBinding();
		
		binding.set('isResentPhonePopupOpen', false);
	},
	handleClickSendSmsPopupClose: function(){
		const binding = this.getDefaultBinding();
		
		binding.set('isSendSmsPopupOpen', false);
	},
	isPhoneVerified: function() {
		const binding = this.getDefaultBinding();
		
		return binding.toJS('isPhoneVerified');
	},
	isErrorPhoneVerification: function() {
		const binding = this.getDefaultBinding();
		
		return binding.toJS('isErrorPhoneVerification');
	},
	isResentPhonePopupOpen: function() {
		const binding = this.getDefaultBinding();
		
		return binding.toJS('isResentPhonePopupOpen');
	},
	isSendSmsPopupOpen: function() {
		const binding = this.getDefaultBinding();
		
		return binding.toJS('isSendSmsPopupOpen');
	},
	handleClickResendPhone: function() {
		const 	binding = this.getDefaultBinding();
		
		window.Server.profilePhoneResend.post()
		.then(data => {
			const interval = new Date(data.nextResendAt).getTime() - new Date().getTime();
			binding.atomically()
			.set('canUserResendPhoneVerification', 	false)
			.set('isResentPhonePopupOpen', 			!this.isResentPhonePopupOpen())
			.commit();
			setTimeout(() => {binding.set('canUserResendPhoneVerification', true)}, interval);
		});
	},
	canUserResendPhoneVerification: function() {
		const binding = this.getDefaultBinding();
		
		return binding.toJS('canUserResendPhoneVerification');
	},
	handleClickConfirmPhone: function (phoneCode) {
		const binding = this.getDefaultBinding();
		
		window.Server.confirmUserPhone.post( {token: phoneCode} ).then(data => {
			if(data.confirmed) {
				binding.atomically()
					.set('isPhoneVerified', true)
					.set('isErrorPhoneVerification', false)
					.commit();
			} else {
				binding.set('isErrorPhoneVerification', true);
			}
		}).catch(() => {
			binding.set('isErrorPhoneVerification', true);
		});
	},
	handleSuccessPhoneChange: function(newPhone) {
		const binding = this.getDefaultBinding();
		
		binding.set('inviteData.phone', Immutable.fromJS(newPhone));
		this.forceUpdate();
	},
	handleClickContinueButton: function(){
		const hostName = document.location.hostname.replace('invite', 'app');
		
		document.location.hash = 'login';
		document.location.hostname = hostName;
	},
	handleChangePhone: function(phone){
		const binding = this.getDefaultBinding();
		
		window.Server.phoneCheck.post({ phone }).then(result => {
			binding.set('isPhoneExist', !Boolean(result.phone));
		});
	},
	isPhoneExist:  function(){
		const binding = this.getDefaultBinding();
		
		return 	typeof binding.toJS('isPhoneExist') === 'undefined' ? true : binding.toJS('isPhoneExist');
	},
	handleClickSendSms: function(phone){
		const 	binding 	= this.getDefaultBinding();
		
		window.Server.profilePhone.put({ phone }).then(() => {
			binding.atomically()
			.set('inviteData.phone', phone)
			.set('isSendSmsPopupOpen', true)
			.commit();
		});
	},
	render: function(){
		const 	binding 	= this.getDefaultBinding(),
				phone 		= binding.toJS('inviteData.phone') || '+44',
				isVerified 	= Boolean(binding.toJS('isPhoneVerified')),
				isSync 		= binding.toJS('isSync');
		
		if (isSync) {
			return (
				<div className="bMainLayout mClearFix">
					<div className="bPageWrap">
						<div className="bSchoolMaster">
							<div className="bUserInvite">
								<h1>Welcome to Squad In Touch!</h1>
								<PhoneVerification
									phone 								= { phone }
									isPhoneVerified 					= { this.isPhoneVerified() }
									isPhoneExist 						= { this.isPhoneExist() }
									isErrorPhoneVerification 			= { this.isErrorPhoneVerification() }
									handleClickConfirmPhone 			= { this.handleClickConfirmPhone }
									handleSuccessPhoneChange 			= { this.handleSuccessPhoneChange }
									handleClickResendPhone 				= { this.handleClickResendPhone }
									canUserResendPhoneVerification 		= { this.canUserResendPhoneVerification() }
									isResentPhonePopupOpen 				= { this.isResentPhonePopupOpen() }
									handleClickPhonePopupClose 			= { this.handleClickPhonePopupClose }
									handleChangePhone 					= { this.handleChangePhone }
									handleClickSendSms 					= { this.handleClickSendSms }
									isSendSmsPopupOpen 					= { this.isSendSmsPopupOpen() }
									handleClickSendSmsPopupClose 		= { this.handleClickSendSmsPopupClose }
								/>
								<If condition = { isVerified }>
									<Button
										onClick 	= { this.handleClickContinueButton }
										text 		= { "Continue" }
									/>
								</If>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<Loader condition = { true } />
				</div>

			);
		}
	}
});

module.exports = Application;