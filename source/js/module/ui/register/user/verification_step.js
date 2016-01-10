const   Form = require('module/ui/form/form'),
        FormField = require('module/ui/form/form_field'),
        FormColumn = require('module/ui/form/form_column'),
        PermissionsList = require('module/as_manager/pages/school_admin/permissions/permissions_list'),
        SVG = require('module/ui/svg'),
        If = require('module/ui/if/if'),
        Autocomplete = require('module/ui/autocomplete/autocomplete'),
        React = require('react'),
        ReactDOM = require('reactDom');

const VerificationStep = React.createClass({
    mixins: [Morearty.Mixin],
    displayName: 'VerificationStep',
    propTypes: {
        onSuccess: React.PropTypes.func
    },
    confirmEmail: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            accountBinding = self.getBinding('account'),
            formFieldsBinding = self.getBinding('formFields');

		window.Server.confirmUser.get({
            uid: accountBinding.get('userId'),
            token: binding.get('emailCode')
        }).then(function () {

			formFieldsBinding.set('verified.email', true);
            accountBinding.set('account.user.verified.email', true);
            binding.set('emailConfirmationError',false);
            if (formFieldsBinding.get('verified.phone')) {
                self.props.onSuccess();
            }
        }, function () {
            binding.set('emailConfirmationError',true);
        });
    },
    confirmPhone: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            accountBinding = self.getBinding('account'),
            formFieldsBinding = self.getBinding('formFields');

		window.Server.confirmUserPhone.get({
            uid: accountBinding.get('userId'),
            token: binding.get('phoneCode')
        }).then(function () {
            formFieldsBinding.set('verified.phone', true);
            accountBinding.set('account.user.verified.phone', true);
            binding.set('phoneConfirmationError',false);
            if (formFieldsBinding.get('verified.email')) {
                self.props.onSuccess();
            }
        }, function () {
            binding.set('phoneConfirmationError',true);
        });
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            accountBinding = self.getBinding('account'),
            //Append classes to cause the check button to be hidden or shown
            phoneCheckClasses = accountBinding !== undefined?(accountBinding.get('account.user.verified.phone')==true?'bButton_hide':'bButton'):'bButton',
            emailCheckClasses = accountBinding !== undefined?(accountBinding.get('account.user.verified.email')==true?'bButton_hide':'bButton'):'bButton',
            emailErrorCheck = (binding.get('emailConfirmationError')!== undefined && binding.get('emailConfirmationError') == true)? 'eRegistration_label':'bButton_hide',
            phoneErrorCheck = (binding.get('phoneConfirmationError') !== undefined && binding.get('phoneConfirmationError') == true)?'eRegistration_label':'bButton_hide',
            isEmailCheck = emailCheckClasses === 'bButton_hide'? 'bCheck_show':'bButton_hide',
            isPhoneCheck = phoneCheckClasses === 'bButton_hide'?'bCheck_show':'bButton_hide';
        return (
            <div className="eRegistration_verification">
                <label className="eRegistration_label">
                    <span className="eRegistration_labelField">Verification email</span>
                    <Morearty.DOM.input className='eRegistration_input'
                                        ref='emailCodeField'
                                        value={ binding.get('emailCode') }
                                        placeholder="email code"
                                        onChange={ Morearty.Callback.set(binding, 'emailCode') }/>
                    <button ref="emailCheck" className={emailCheckClasses} onClick={self.confirmEmail}>check</button>
                    <span className={isEmailCheck}><SVG icon="icon_check" classes="bButton_svg_check" /></span>
                </label>
                <label className={emailErrorCheck}>
                    <span className="eForm_fieldValidText verify_error">An error occurred please try again</span>
                </label>
                <label className="eRegistration_label">
                    <span className="eRegistration_labelField">Verification phone</span>
                    <Morearty.DOM.input className='eRegistration_input'
                                        ref='phoneCodeField'
                                        value={ binding.get('phoneCode') }
                                        placeholder="phone code"
                                        onChange={ Morearty.Callback.set(binding, 'phoneCode') }/>
                    <button ref="phoneCheck" className={phoneCheckClasses} onClick={self.confirmPhone}>check</button>
                    <span className={isPhoneCheck}><SVG icon="icon_check" classes="bButton_svg_check" /></span>
                </label>
                <label className={phoneErrorCheck}>
                    <span className="eForm_fieldValidText verify_error">An error occurred please try again</span>
                </label>
            </div>
        );
    }
});


module.exports = VerificationStep;
