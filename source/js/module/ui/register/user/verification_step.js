const   SVG                             = require('module/ui/svg'),
        Popup                           = require('./../../../ui/new_popup'),
        ChangeUserContactFieldModule    = require('./changeUserContactFieldModule'),
        Morearty                        = require('morearty'),
        React                           = require('react');

const VerificationStep = React.createClass({
    mixins: [Morearty.Mixin],
    displayName: 'VerificationStep',
    propTypes: {
        onSuccess: React.PropTypes.func
    },
    confirmEmail: function () {
        const   self            = this,
                binding         = self.getDefaultBinding(),
				rootBinding		= self.getMoreartyContext().getBinding(),
				verified		= rootBinding.sub('userData.authorizationInfo.verified'),
                accountBinding  = self.getBinding('account');

		window.Server.confirmUser.post({
            token: binding.get('emailCode')
        }).then( data => {
            if(data.confirmed === true) {
                accountBinding.set('verified.email', true);
				verified.set('email', true);
				binding.set('emailConfirmationError',false);
                if (accountBinding.get('verified.phone')) {
                    self.props.onSuccess();
                }
            } else {
                binding.set('emailConfirmationError',true);
            }
        }).catch(() => {
            binding.set('emailConfirmationError',true);
        });
    },
    confirmPhone: function () {
        const   self            = this,
                binding         = self.getDefaultBinding(),
				rootBinding		= self.getMoreartyContext().getBinding(),
				verified		= rootBinding.sub('userData.authorizationInfo.verified'),
                accountBinding  = self.getBinding('account');
		window.Server.confirmUserPhone.post({
            token: binding.get('phoneCode')
        }).then( data => {
            if(data.confirmed === true) {
                accountBinding.set('verified.phone', true);
				verified.set('phone', true);
                binding.set('phoneConfirmationError',false);
                if (accountBinding.get('verified.email')) {
                    self.props.onSuccess();
                }
            } else {
                binding.set('phoneConfirmationError',true);
            }
        }).catch(() => {
            binding.set('phoneConfirmationError',true);
        });
    },
    handleClickResendEmail: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        binding.set('isEmailResendPopupOpening', true);
    },
    handleClickResendPhone: function() {
        const   self    = this,
            binding = self.getDefaultBinding();

        binding.set('isPhoneResendPopupOpening', true);
    },
    handleClickCloseResendEmailPopup: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        binding.set('isEmailResendPopupOpening', false);
    },
    handleClickCloseResendPhonePopup: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        binding.set('isPhoneResendPopupOpening', false);
    },
    render: function () {
        const   self                = this,
                binding             = self.getDefaultBinding(),
                accountBinding      = self.getBinding('account'),
                //Append classes to cause the check button to be hidden or shown
                phoneCheckClasses   = accountBinding !== undefined?(accountBinding.get('verified.phone')==true?'bButton_hide':'bButton'):'bButton',
                emailCheckClasses   = accountBinding !== undefined?(accountBinding.get('verified.email')==true?'bButton_hide':'bButton'):'bButton',
                emailErrorCheck     = (binding.get('emailConfirmationError')!== undefined && binding.get('emailConfirmationError') == true)? 'eRegistration_label':'bButton_hide',
                phoneErrorCheck     = (binding.get('phoneConfirmationError') !== undefined && binding.get('phoneConfirmationError') == true)?'eRegistration_label':'bButton_hide',
                isEmailCheck        = emailCheckClasses === 'bButton_hide'? 'bCheck_show':'bButton_hide',
                isPhoneCheck        = phoneCheckClasses === 'bButton_hide'?'bCheck_show':'bButton_hide';

        return (
            <div className="eRegistration_verification">
                <label className="eRegistration_label">
                    <span className="eRegistration_labelField">Verification email</span>
                    <input className    ='eRegistration_input'
                           ref          ='emailCodeField'
                           value        ={ binding.get('emailCode') }
                           placeholder  ="email code"
                           onChange     ={ Morearty.Callback.set(binding, 'emailCode') }/>
                    <button ref="emailCheck" className={emailCheckClasses} onClick={self.confirmEmail}>Verify</button>
                    <span className={isEmailCheck}><SVG icon="icon_check" classes="bButton_svg_check" /></span>
                </label>
                <div className="eRegisterMessage">
                    We sent your verification letter to <b>{binding.toJS('userData.email')}</b>.
                    <a onClick={self.handleClickResendEmail}>
                        Not receive/wrong email?
                    </a>
                </div>
                <div className={emailErrorCheck}>
                    <span className="verify_error">An error occurred please try again</span>
                </div>
                <label className="eRegistration_label">
                    <span className="eRegistration_labelField">Verification phone</span>
                    <input className='eRegistration_input'
                                        ref='phoneCodeField'
                                        value={ binding.get('phoneCode') }
                                        placeholder="phone code"
                                        onChange={ Morearty.Callback.set(binding, 'phoneCode') }/>
                    <button ref="phoneCheck" className={phoneCheckClasses} onClick={self.confirmPhone}>Verify</button>
                    <span className={isPhoneCheck}><SVG icon="icon_check" classes="bButton_svg_check" /></span>
                </label>
                <div className={phoneErrorCheck}>
                    <span className="verify_error">An error occurred please try again</span>
                </div>
                <div className="eRegisterMessage">
                    We sent your verification sms to <b>{binding.toJS('userData.phone')}</b>.
                    <a onClick={self.handleClickResendPhone}>
                        Not receive/wrong phone number?
                    </a>
                </div>
                <div className="eRegisterMessage">
                    Having trouble signing up?
                    <a href="mailto:support@squadintouch.com?subject=Registration">
                        Email us
                    </a>
                </div>
                <Popup  isOpened                = { !!binding.toJS('isEmailResendPopupOpening') }
                        handleClickCloseButton  = { self.handleClickCloseResendEmailPopup }
                >
                    <ChangeUserContactFieldModule   type        = { "email" }
                                                    serviceName = { "profileEmail" }
                                                    data        = { binding.toJS('userData.email') }
                    />
                </Popup>
                <Popup  isOpened                = { !!binding.toJS('isPhoneResendPopupOpening') }
                        handleClickCloseButton  = { self.handleClickCloseResendPhonePopup }
                >
                    <ChangeUserContactFieldModule   type        = { "phone" }
                                                    serviceName = { "profilePhone" }
                                                    data        = { binding.toJS('userData.phone') }
                    />
                </Popup>
            </div>
        );
    }
});


module.exports = VerificationStep;
