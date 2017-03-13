const   React                           = require('react'),
        classNames                      = require('classnames'),
        SVG                             = require('module/ui/svg'),
        Popup                           = require('./../../../ui/new_popup'),
        If                              = require('./../../../ui/if/if'),
        ChangeUserProfileFieldModule    = require('./changeUserProfileFieldModule');

const VerificationStep = React.createClass({
    propTypes: {
        email:                              React.PropTypes.string.isRequired,
        isEmailVerified:                    React.PropTypes.bool.isRequired,
        isErrorEmailVerification:           React.PropTypes.bool.isRequired,
        phone:                              React.PropTypes.string.isRequired,
        isPhoneVerified:                    React.PropTypes.bool.isRequired,
        isErrorPhoneVerification:           React.PropTypes.bool.isRequired,
        handleClickConfirmEmail:            React.PropTypes.func.isRequired,
        handleClickConfirmPhone:            React.PropTypes.func.isRequired,
        handleSuccessEmailChange:           React.PropTypes.func.isRequired,
        handleSuccessPhoneChange:           React.PropTypes.func.isRequired,
        canUserResendEmailVerification:     React.PropTypes.bool.isRequired,
        canUserResendPhoneVerification:     React.PropTypes.bool.isRequired,
        handleClickResendEmail:             React.PropTypes.func.isRequired,
        handleClickResendPhone:             React.PropTypes.func.isRequired,
        isResentEmailPopupOpen:             React.PropTypes.bool.isRequired,
        handleClickEmailPopupClose:         React.PropTypes.func.isRequired,
        isResentPhonePopupOpen:             React.PropTypes.bool.isRequired,
        handleClickPhonePopupClose:         React.PropTypes.func.isRequired
    },

    getInitialState: function(){
        return {
            isChangeEmailPopupOpen: false,
            isChangePhonePopupOpen: false
        };
    },

    handleClickWrongEmail: function() {
        this.setState({'isChangeEmailPopupOpen': true});
    },
    handleClickWrongPhone: function() {
        this.setState({'isChangePhonePopupOpen': true});
    },
    handleClickCloseChangeEmailPopup: function() {
        this.setState({'isChangeEmailPopupOpen': false});
    },
    handleClickCloseChangePhonePopup: function() {
        this.setState({'isChangePhonePopupOpen': false});
    },
    getEmailCodeCheckButtonClassName: function() {
        return classNames({
            bButton:        !this.props.isEmailVerified,
            mSmall:        !this.props.isEmailVerified,
            bButton_hide:   this.props.isEmailVerified
        });
    },
    getPhoneCodeCheckButtonClassName: function() {
        return classNames({
            bButton:        !this.props.isPhoneVerified,
            mSmall:        !this.props.isPhoneVerified,
            bButton_hide:   this.props.isPhoneVerified
        });
    },
    getEmailCheckSuccessIconClassName: function() {
        return classNames({
            bCheck_show:    this.props.isEmailVerified,
            bButton_hide:   !this.props.isEmailVerified
        });
    },
    getPhoneCheckSuccessIconClassName: function() {
        return classNames({
            bCheck_show:    this.props.isPhoneVerified,
            bButton_hide:   !this.props.isPhoneVerified
        });
    },
    getErrorEmailVerificationTextClassName: function() {
        return classNames({
            eRegistration_label:    this.props.isErrorEmailVerification,
            bButton_hide:           !this.props.isErrorEmailVerification
        });
    },
    getErrorPhoneVerificationTextClassName: function() {
        return classNames({
            eRegistration_label:    this.props.isErrorPhoneVerification,
            bButton_hide:           !this.props.isErrorPhoneVerification
        });
    },
    getEmailResendLinkClassName: function() {
        return classNames({
            bLink:      true,
            mDisable:   !this.props.canUserResendEmailVerification
        });
    },
    getPhoneResendLinkClassName: function() {
        return classNames({
            bLink:      true,
            mDisable:   !this.props.canUserResendPhoneVerification
        });
    },
    handleChangeEmailCode: function(eventDescriptor) {
        this.setState( {emailCode: eventDescriptor.target.value} );
    },
    handleChangePhoneCode: function(eventDescriptor) {
        this.setState( {phoneCode: eventDescriptor.target.value} );
    },
    handleClickConfirmEmail: function() {
        this.props.handleClickConfirmEmail(this.state.emailCode);
    },
    handleClickConfirmPhone: function() {
        this.props.handleClickConfirmPhone(this.state.phoneCode);
    },
    render: function () {
        return (
            <div className="eRegistration_verification">
                <label className="eRegistration_label">
                    <span className="eRegistration_labelField">Email Verification Code</span>
                    <input className    = 'eRegistration_input'
                           ref          = 'emailCodeField'
                           value        = { this.state.emailCode }
                           placeholder  = "Email code"
                           onChange     = { this.handleChangeEmailCode }
                    />
                    <button     className   = { this.getEmailCodeCheckButtonClassName() }
                                onClick     = { this.handleClickConfirmEmail }
                    >
                        Verify
                    </button>
                    <span className={ this.getEmailCheckSuccessIconClassName() }>
                        <SVG icon="icon_check" classes="bButton_svg_check" />
                    </span>
                </label>
                <If condition={!this.props.isEmailVerified}>
                    <div className="eRegisterMessage">
                        We have sent your verification letter to <b>{ this.props.email }</b><br/>
                        <a  className   = { this.getEmailResendLinkClassName() }
                            onClick     = { this.props.handleClickResendEmail }
                        >
                            Send code again.
                        </a><br/>
                        <a onClick={ this.handleClickWrongEmail }>
                            Wrong email?
                        </a><br/>
                    </div>
                </If>
                <div className={ this.getErrorEmailVerificationTextClassName() }>
                    <span className="verify_error">An error occurred please try again</span>
                </div>
                <label className="eRegistration_label">
                    <span className="eRegistration_labelField">Phone Verification Code</span>
                    <input  className   = 'eRegistration_input'
                            value       = { this.state.phoneCode }
                            placeholder = "Phone code"
                            onChange    = { this.handleChangePhoneCode }
                    />
                    <button     className   = { this.getPhoneCodeCheckButtonClassName() }
                                onClick     = { this.handleClickConfirmPhone }
                    >
                        Verify
                    </button>
                    <span className={ this.getPhoneCheckSuccessIconClassName() }>
                        <SVG icon="icon_check" classes="bButton_svg_check" />
                    </span>
                </label>
                <div className={ this.getErrorPhoneVerificationTextClassName() }>
                    <span className="verify_error">An error occurred please try again</span>
                </div>
                <If condition={!this.props.isPhoneVerified}>
                    <div className="eRegisterMessage">
                        We have sent your verification sms to <b>{ this.props.phone }</b><br/>
                        <a  className   = { this.getPhoneResendLinkClassName() }
                            onClick     = { this.props.handleClickResendPhone }
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
                <Popup  isOpened                = { this.props.isResentEmailPopupOpen }
                        handleClickCloseButton  = { this.props.handleClickEmailPopupClose }
                        isShowCloseButton       = { true }
                >
                    <span className="ePopupText">Email verification letter was sent to your address.</span>
                </Popup>
                <Popup  isOpened                = { this.state.isChangeEmailPopupOpen }
                        handleClickCloseButton  = { this.handleClickCloseChangeEmailPopup }
                        isShowCloseButton       = { true }
                >
                    <ChangeUserProfileFieldModule   labelText               = { "Enter your email address" }
                                                    successText             = {
                                                                                `We have sent the verification code to ${this.props.email}`
                                                                            }
                                                    errorText               = { "This email already used" }
                                                    serverFieldName         = { "email" }
                                                    service                 = { window.Server.profileEmail }
                                                    data                    = { this.props.email }
                                                    handleSuccessDataChange = { this.props.handleSuccessEmailChange }
                    />
                </Popup>
                <Popup  isOpened                = { this.props.isResentPhonePopupOpen }
                        handleClickCloseButton  = { this.props.handleClickPhonePopupClose }
                        isShowCloseButton       = { true }
                >
                    <span className="ePopupText">We have sent the verification code again; please check your text messages.</span>
                </Popup>
                <Popup  isOpened                = { this.state.isChangePhonePopupOpen }
                        handleClickCloseButton  = { this.handleClickCloseChangePhonePopup }
                        isShowCloseButton       = { true }
                >
                    <ChangeUserProfileFieldModule   labelText               = { "Enter your phone number" }
                                                    successText             = {
                                                                                `We have sent the verification code to ${this.props.phone}`
                                                                            }
                                                    errorText               = { "This phone already used" }
                                                    serverFieldName         = { "phone" }
                                                    service                 = { window.Server.profilePhone }
                                                    data                    = { this.props.phone }
                                                    handleSuccessDataChange = { this.props.handleSuccessPhoneChange }
                    />
                </Popup>
            </div>
        );
    }
});

module.exports = VerificationStep;