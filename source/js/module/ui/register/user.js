const   RegisterDone        = require('module/ui/register/user/register_done'),
        AccountForm         = require('module/ui/register/user/account_step'),
        PermissionsList     = require('module/ui/register/user/permissions_step'),
        VerificationStep    = require('module/ui/register/user/verification_step'),
        classNames          = require('classnames'),
        React               = require('react'),
        Immutable 	        = require('immutable'),
        $                   = require('jquery'),
        Morearty            = require('morearty'),
        Helpers             = require('module/helpers/storage');

// TODO: remove jquery

const RegisterUserPage = React.createClass({
    mixins: [Morearty.Mixin],
    // TODO: вынести значение поля step в мета-данные
    getDefaultState: function () {
        return Immutable.Map({
            registerStep:                       'account',

            isSync:                             true,

            canUserResendEmailVerification:     true,
            canUserResendPhoneVerification:     true,

            isErrorEmailVerification:           false,
            isErrorPhoneVerification:           false,

            isResentEmailPopupOpen:             false,
            isResentPhonePopupOpen:             false
        });
    },
    componentWillMount: function () {
        const self = this,
              mainTitle = 'Sign up for Squad In Touch';

        self.steps = [
            {
                name: 'account',
                title: 'Personal Details',
                mainTitle: mainTitle,
                description: <div><p>Enter your contact details and choose a password you wish to use for logging in to
                    your account.</p>

                    <p>We ask you to provide your valid mobile phone number and email address.</p>

                    <p>We'll use your mobile phone number and email address to send you activation codes.</p>

                    <p>You cannot work in the system unless you verify your email address and phone number using these
                        codes.</p>

                    <p> You will also use your email address for logging in to the system.</p></div>
            },
            {
                name: 'verification',
                title: 'User Verification',
                mainTitle: mainTitle,
                description: <p>Activation codes were sent to your email address and mobile phone. Please, enter them
                    below to complete the registration.</p>
            },
            {
                name: 'permissions',
                title: 'Permissions Setup',
                mainTitle: mainTitle,
                description: <p>
                    Please choose the role and school you would like to join. If you wish to get more than one role at
                    the same
                    school (for instance, a teacher and a parent) choose one of them and you will be able to request
                    more
                    permissions once your account has been confirmed.</p>
            },
            {
                name: 'finish',
                title: 'Finish',
                mainTitle: 'Registration almost done'
            }
        ];

		self.initStep();
    },
	initStep:function(){
		const   self            = this,
			    binding         = self.getDefaultBinding(),
			    rootBinding		= self.getMoreartyContext().getBinding(),
			    verified		= rootBinding.toJS('userData.authorizationInfo.verified'),
			    isAuthorized	= !!rootBinding.get('userData.authorizationInfo.userId'),
			    isVerified		= verified && verified.email && verified.sms;

		if(isAuthorized)
			if(isVerified)
				binding.set('registerStep', 'permissions');
			else
				binding.set('registerStep', 'verification');

	},
    setStepFunction: function (step, data) {
        const   self            = this,
                binding         = self.getDefaultBinding(),
                currentStep     = binding.get('registerStep');

        if (currentStep === 'account') {
            const   service         = window.Server._login,
                    serveBinding    = service.binding;

            service.post(
                {
                    email:      binding.get('formFields').email,
                    password:   binding.get('formFields').password
                }
            ).then(loginData => {
                    if(loginData.key) {
                        const authorizationInfo = {
                            id: loginData.key,
                            userId:loginData.userId,
                            expireAt: loginData.expireAt,
                            verified: {
                                "email":false,
                                "sms":false,
                                "personal":true
                            },
                            email: binding.toJS('formFields').email,
                            phone: binding.toJS('formFields').phone
                        };

                        serveBinding.set(Immutable.fromJS(authorizationInfo));
                        binding.atomically()
                            .set('account',         Immutable.fromJS(authorizationInfo))
                            .set('registerStep',    step)
                            .commit();
                    }
                });
        } else {
            binding.set('registerStep', step);
        }
    },
    catchStepFunctionError:function(step, data){
        //Temporary solution to for the 422 error
        //Notify user of the error and allow to try again
        let message;
        switch (data){
            case 422:
                message = data.responseJSON.details.text;
                window.simpleAlert(
                    `${message} - so please try again!`,
                    'Ok',
                    () => {}
                );
                break;
            default:
                message = data.responseJSON.details.text;
                window.simpleAlert(
                    message,
                    'Ok',
                    () => {}
                );
                break;
        }
        $('.bButton').text('Continue →');   // TODO: remove that shit
    },
    finish: function () {
		const binding = this.getDefaultBinding();

		Helpers.cookie.remove('authorizationInfo');
		binding.sub('authorizationInfo').clear();
		document.location.href = '/';
    },
    renderMainTitle: function (step) {
        const   self        = this,
                binding     = self.getDefaultBinding(),
                currentStep = binding.get('registerStep');
        return <div>
            {self.steps.map(function (step) {
                var stepClasses = classNames({
                    bRegistrationTitle: true,
                    mActive: currentStep === step.name
            });
                return <div key={step.name+'1'} className={stepClasses}>{step.mainTitle}</div>;
            })}
        </div>
    },

    renderProgress: function (){
        const   self            = this,
                binding         = self.getDefaultBinding(),
                currentStep     = binding.get('registerStep');

        switch (currentStep) {
            case 'account':         return <div className="eStepComplete" style={{width:20+'px'}}></div>;
            case 'verification':    return <div className="eStepComplete" style={{width:113+'px'}}></div>;
            case 'permissions':     return <div className="eStepComplete" style={{width:208+'px'}}></div>;
            case 'finish':          return <div className="eStepComplete" style={{width:320+'px'}}></div>;
        }
    },

    renderSteps: function () {
        const   self        = this,
                binding     = self.getDefaultBinding(),
                currentStep = binding.get('registerStep');

        return <div className="bStepProgress_wrap">
            <div className="bStepProgress">
            {self.steps.map(function (step) {
                var stepClasses = classNames({
                    eStepProgress_progressItem: true,
                    mActive: currentStep === step.name
                });

                return <span key={step.name+'2'} className={stepClasses}>{step.title}</span>;
            })}
            </div>
            <div className ="bProgressStrip">
                {self.renderProgress()}
            </div>
                {self.steps.map(function (step) {
                var descriptionClasses = classNames({
                    eStepDescription: true,
                    mActive: currentStep === step.name
                });
                return <div key={step.name+'3'} className={descriptionClasses}>{step.description}</div>;
            })}
        </div>;
    },

    handleClickConfirmEmail: function (emailCode) {
        const   self                = this,
                binding             = self.getDefaultBinding(),
                verificationBinding = self.getMoreartyContext().getBinding().sub('userData.authorizationInfo.verified');

        binding.set('isSync', false);

        window.Server.confirmUser.post( {token: emailCode} ).then(data => {
            if(data.confirmed) {
                verificationBinding.set('email',        Immutable.fromJS(true));
                binding.atomically()
                    .set('isSync',                      true)
                    .set('isErrorEmailVerification',    false)
                    .commit();

                verificationBinding.toJS('sms') && self.setStepFunction('permissions');
            } else {
                binding.set('isErrorEmailVerification', true);
            }
        }).catch(() => {
            binding.set('isErrorEmailVerification', true);
        });
    },
    handleClickConfirmPhone: function (phoneCode) {
        const   self                = this,
                binding             = self.getDefaultBinding(),
                verificationBinding = self.getMoreartyContext().getBinding().sub('userData.authorizationInfo.verified');

        binding.set('isSync', false);

        window.Server.confirmUserPhone.post( {token: phoneCode} ).then(data => {
            if(data.confirmed) {
                verificationBinding.set('sms', true);
                binding.atomically()
                    .set('isSync',                      true)
                    .set('isErrorPhoneVerification',    false)
                    .commit();

                verificationBinding.toJS('email') && self.setStepFunction('permissions');
            } else {
                binding.set('isErrorPhoneVerification', true);
            }
        }).catch(() => {
            binding.set('isErrorPhoneVerification', true);
        });
    },
    handleClickResendEmail: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

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
        const   self                        = this,
                authorizationInfoBinding    = self.getMoreartyContext().getBinding().sub('userData.authorizationInfo');

        authorizationInfoBinding.set('email', Immutable.fromJS(newEmail));
        this.forceUpdate();
    },
    handleClickResendPhone: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        window.Server.profilePhoneResend.post()
            .then(data => {
                const interval = new Date(data.nextResendAt).getTime() - new Date().getTime();
                binding.atomically()
                    .set('canUserResendPhoneVerification',  false)
                    .set('isResentPhonePopupOpen',          !this.isResentPhonePopupOpen())
                    .commit();
                setTimeout(() => {binding.set('canUserResendEmailVerification', true)}, interval);
            });
    },
    handleSuccessPhoneChange: function(newPhone) {
        const   self                        = this,
                authorizationInfoBinding    = self.getMoreartyContext().getBinding().sub('userData.authorizationInfo');

        authorizationInfoBinding.set('phone', Immutable.fromJS(newPhone));
        this.forceUpdate();
    },
    getEmail: function() {
        return this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.email');
    },
    getPhone: function() {
        return this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.phone');
    },

    isEmailVerified: function() {
        return this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.verified.email');
    },
    isPhoneVerified: function() {
        return this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.verified.sms');
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
        const   self        = this,
                binding     = self.getDefaultBinding(),
                currentStep = binding.get('registerStep');

        let currentView = null;

        switch (currentStep) {
            case 'account':
                currentView = (
                    <AccountForm    onSuccess   = {self.setStepFunction.bind(null, 'verification')}
                                    onError     = {self.catchStepFunctionError.bind(null,'verification')}
                                    binding     = {binding.sub('formFields')}
                    />
                );
                break;
            case 'verification':
                currentView = (
                    <VerificationStep   email                           = { this.getEmail() }
                                        isEmailVerified                 = { this.isEmailVerified() }
                                        isErrorEmailVerification        = { this.isErrorEmailVerification() }
                                        phone                           = { this.getPhone() }
                                        isPhoneVerified                 = { this.isPhoneVerified() }
                                        isErrorPhoneVerification        = { this.isErrorPhoneVerification() }
                                        handleClickConfirmEmail         = { this.handleClickConfirmEmail }
                                        handleClickConfirmPhone         = { this.handleClickConfirmPhone }
                                        handleSuccessEmailChange        = { this.handleSuccessEmailChange }
                                        handleSuccessPhoneChange        = { this.handleSuccessPhoneChange }
                                        canUserResendEmailVerification  = { this.canUserResendEmailVerification() }
                                        canUserResendPhoneVerification  = { this.canUserResendPhoneVerification() }
                                        handleClickResendEmail          = { this.handleClickResendEmail }
                                        handleClickResendPhone          = { this.handleClickResendPhone }
                                        isResentEmailPopupOpen          = { this.isResentEmailPopupOpen() }
                                        handleClickEmailPopupClose      = { this.handleClickEmailPopupClose }
                                        isResentPhonePopupOpen          = { this.isResentPhonePopupOpen() }
                                        handleClickPhonePopupClose      = { this.handleClickPhonePopupClose }
                    />
                );
                break;
            case 'permissions':
                currentView = <PermissionsList
                    onSuccess={self.setStepFunction.bind(null, 'finish')}
                    binding={{
                        //account: binding.sub('account'),
                        //formFields: binding.sub('formFields'),
                        default: binding
					}}
                    />;
                break;
            case 'finish':
                currentView = <RegisterDone
                    onSuccess={self.finish}
                    binding={{default:binding}}
                />;
                break;
        }

        return (
            <div>
                {self.renderMainTitle()}
                <div className="bRegistration">
                    {self.renderSteps()}
                    {currentView}
                </div>
            </div>
        )
    }
});


module.exports = RegisterUserPage;
