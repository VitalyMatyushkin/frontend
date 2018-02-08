const   AccountForm         = require('module/ui/register/user/account_step'),
        {PermissionsStep}   = require('module/ui/register/user/permissions_step/permissions_step'),
        VerificationStep    = require('module/ui/register/user/verification_step'),
        classNames          = require('classnames'),
        React               = require('react'),
        Immutable 	        = require('immutable'),
        $                   = require('jquery'),
        Morearty            = require('morearty'),
	    propz				= require('propz'),
        SessionHelper		= require('module/helpers/session_helper'),
		Loader              = require('module/ui/loader');
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

	    this.getDefaultBinding().set('isSync',true);

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
                description: <p>Please choose a role and the school you would like to join.
	                If you wish to have more than one role linked to the same school (for instance a teacher and parental role)
	                simply choose one role and you will be able to request more permissions once your account
	                has been confirmed by the school.</p>
            }
        ];

		self.initStep();
    },
	getUserDataBinding: function () {
		return this.getMoreartyContext().getBinding().sub('userData');
	},
	initStep:function(){
		const binding = this.getDefaultBinding();

		const loginSession = SessionHelper.getLoginSession(
			this.getUserDataBinding()
		);

		const verified = propz.get(loginSession, ['verified']);

		const isAuthorized = !!propz.get(loginSession, ['userId']);

		const isVerified = verified && verified.email && verified.sms;

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

	        binding.set('isSync', false);

            service.post(
                {
                    email:      binding.get('formFields').email,
                    password:   binding.get('formFields').password
                }
            ).then(loginData => {
                    if(loginData.key) {
                        const activeSession = {
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

						const loginSessionBinding = SessionHelper.getLoginSessionBinding(
							this.getUserDataBinding()
						);
						loginSessionBinding.set(Immutable.fromJS(activeSession));

                        binding.atomically()
                            .set('account',         Immutable.fromJS(activeSession))
                            .set('registerStep',    step)
                            .set('isSync',    true)
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
            case 'verification':    return <div className="eStepComplete" style={{width:160+'px'}}></div>;
            case 'permissions':     return <div className="eStepComplete" style={{width:320+'px'}}></div>;
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
                verificationBinding = SessionHelper.getLoginSessionBinding( this.getUserDataBinding() ).sub('verified');

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
                verificationBinding = SessionHelper.getLoginSessionBinding( this.getUserDataBinding() ).sub('verified');

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
                loginSessionBinding    = SessionHelper.getLoginSessionBinding( this.getUserDataBinding() );

		loginSessionBinding.set('email', Immutable.fromJS(newEmail));
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
			    loginSessionBinding    = SessionHelper.getLoginSessionBinding( this.getUserDataBinding() );

		loginSessionBinding.set('phone', Immutable.fromJS(newPhone));
        this.forceUpdate();
    },
    getEmail: function() {
    	const loginSessionBinding = SessionHelper.getLoginSession(
    		this.getUserDataBinding()
		);

        return propz.get(loginSessionBinding, ['email']);
    },
    getPhone: function() {
		const loginSessionBinding = SessionHelper.getLoginSession(
			this.getUserDataBinding()
		);

		return propz.get(loginSessionBinding, ['phone']);
    },

    isEmailVerified: function() {
		const loginSessionBinding = SessionHelper.getLoginSession(
			this.getUserDataBinding()
		);

		return propz.get(loginSessionBinding, ['verified', 'email']);
    },
    isPhoneVerified: function() {
		const loginSessionBinding = SessionHelper.getLoginSession(
			this.getUserDataBinding()
		);

		return propz.get(loginSessionBinding, ['verified', 'sms']);
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
                currentStep = 'permissions';
                // currentStep = binding.get('registerStep');

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
                    <VerificationStep   email                          = { this.getEmail() }
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
                );
                break;
            case 'permissions':
                currentView = <PermissionsStep
                    binding={binding.sub('permissionsStep')}
                    />;
                break;
        }

        return (
	        <div>
		        {self.renderMainTitle()}
		        <div className="bRegistration">
			        {self.renderSteps()}
			        {binding.get('isSync') ?
				        <div>
					        {currentView}
				        </div>
				        :
				        <div className="bRegistration_loaderWrapper">
				            <Loader/>
				        </div>
			        }
		        </div>
	        </div>
        )
    }
});


module.exports = RegisterUserPage;
