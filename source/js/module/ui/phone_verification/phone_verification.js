/**
 * Created by Woland on 07.08.2017.
 */
const 	React 							= require('react'),
		classNames 						= require('classnames'),
		SVG 							= require('module/ui/svg'),
		Popup 							= require('module/ui/new_popup'),
		If 								= require('module/ui/if/if'),
		ChangeUserProfileFieldModule 	= require('module/ui/register/user/changeUserProfileFieldModule');

const PhoneVerification = React.createClass({
	propTypes: {
		phone: 								React.PropTypes.string.isRequired,
		isPhoneVerified: 					React.PropTypes.bool.isRequired,
		isErrorPhoneVerification: 			React.PropTypes.bool.isRequired,
		handleClickConfirmPhone: 			React.PropTypes.func.isRequired,
		handleSuccessPhoneChange: 			React.PropTypes.func.isRequired,
		canUserResendPhoneVerification: 	React.PropTypes.bool.isRequired,
		handleClickResendPhone: 			React.PropTypes.func.isRequired,
		isResentPhonePopupOpen: 			React.PropTypes.bool.isRequired,
		handleClickPhonePopupClose: 		React.PropTypes.func.isRequired
	},
	getDefaultProps: function(){
		return {
			phone: 								'',
			isPhoneVerified: 					false,
			isErrorPhoneVerification: 			false,
			canUserResendPhoneVerification: 	true,
			isResentPhonePopupOpen: 			false
		}
	},
	getInitialState: function(){
		return {
			isChangePhonePopupOpen: false
		};
	},
	handleClickWrongPhone: function() {
		this.setState({'isChangePhonePopupOpen': true});
	},
	handleClickCloseChangePhonePopup: function() {
		this.setState({'isChangePhonePopupOpen': false});
	},
	getPhoneCodeCheckButtonClassName: function() {
		return classNames({
			bButton: 		!this.props.isPhoneVerified,
			mSmall: 		!this.props.isPhoneVerified,
			bButton_hide: 	this.props.isPhoneVerified
		});
	},
	getErrorPhoneVerificationTextClassName: function() {
		return classNames({
			eRegistration_label: 	this.props.isErrorPhoneVerification,
			bButton_hide: 			!this.props.isErrorPhoneVerification
		});
	},
	getPhoneCheckSuccessIconClassName: function() {
		return classNames({
			bCheck_show: 	this.props.isPhoneVerified,
			bButton_hide: 	!this.props.isPhoneVerified
		});
	},
	getPhoneResendLinkClassName: function() {
		return classNames({
			bLink: 		true,
			mDisable: 	!this.props.canUserResendPhoneVerification
		});
	},
	handleChangePhoneCode: function(eventDescriptor) {
		this.setState( {phoneCode: eventDescriptor.target.value} );
	},
	handleClickConfirmPhone: function() {
		this.props.handleClickConfirmPhone(this.state.phoneCode);
	},
	render: function(){
		return (
			<div className="eUserInvite_phoneVerification">
				<label className="eRegistration_label">
					<span className="eRegistration_labelField">Phone Verification Code</span>
					<input 	className 	= 'eRegistration_input'
							value 		= { this.state.phoneCode }
							placeholder = "Phone code"
							onChange 	= { this.handleChangePhoneCode }
					/>
					<button 	className 	= { this.getPhoneCodeCheckButtonClassName() }
								onClick 	= { this.handleClickConfirmPhone }
					>
						Verify
					</button>
					<span className = { this.getPhoneCheckSuccessIconClassName() }>
						<SVG icon="icon_check" classes="bButton_svg_check" />
					</span>
				</label>
				<div className = { this.getErrorPhoneVerificationTextClassName() }>
					<span className="verify_error">An error occurred please try again</span>
				</div>
				<If condition={!this.props.isPhoneVerified}>
					<div className="eRegisterMessage">
						We have sent your verification sms to <b>{ this.props.phone }</b><br/>
						<a 	className 	= { this.getPhoneResendLinkClassName() }
							onClick 	= { this.props.handleClickResendPhone }
						>
							Send code again.
						</a><br/>
						<a onClick={ this.handleClickWrongPhone }>
							Wrong phone number?
						</a><br/>
					</div>
				</If>
				<div className="eRegisterMessage">
					Having trouble signing up?
					<a href="mailto:support@squadintouch.com?subject=Registration">
						Email us
					</a>
				</div>
				<Popup 	isOpened 				= { this.props.isResentPhonePopupOpen }
						handleClickCloseButton 	= { this.props.handleClickPhonePopupClose }
						isShowCloseButton 		= { true }
				>
					<span className="ePopupText">We have sent the verification code again; please check your text messages.</span>
				</Popup>
				<Popup 	isOpened 				= { this.state.isChangePhonePopupOpen }
						handleClickCloseButton 	= { this.handleClickCloseChangePhonePopup }
						isShowCloseButton 		= { true }
				>
					<ChangeUserProfileFieldModule 	labelText 				= { "Enter your phone number" }
													successText 			= { `We have sent the verification code to ${this.props.phone}` }
													errorText 				= { "This phone already used" }
													serverFieldName 		= { "phone" }
													service 				= { window.Server.profilePhone }
													data 					= { this.props.phone }
													handleSuccessDataChange = { this.props.handleSuccessPhoneChange }
					/>
				</Popup>
			</div>
		);
	}
});

module.exports = PhoneVerification;