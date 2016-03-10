const   ChooseTypeForm      = require('module/ui/register/user/choose_type'),
        RegisterForm        = require('module/ui/register/user/register_form'),
        RegisterDone        = require('module/ui/register/user/register_done'),
        AccountForm         = require('module/ui/register/user/account_step'),
        PersonalForm        = require('module/ui/register/user/personal_details'),
        PermissionsList     = require('module/ui/register/user/permissions_step'),
        VerificationStep    = require('module/ui/register/user/verification_step'),
        classNames          = require('classnames'),
        React               = require('react'),
        Immutable 	        = require('immutable'),
        $                   = require('jquery'),
        Helpers             = require('module/helpers/storage');

// TODO: remove jquery

const RegisterUserPage = React.createClass({
    mixins: [Morearty.Mixin],
    // TODO: вынести значение поля step в мета-данные
    getDefaultState: function () {
        return Immutable.Map({
            registerStep: 'account'
        });
    },
    componentWillMount: function () {
        var self = this;

        self.steps = [
            {
                name: 'account',
                title: 'Personal Details',
                mainTitle: 'Register on Squadintouch',
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
                mainTitle: 'Register on Squadintouch',
                description: <p>Activation codes were sent to your email address and mobile phone. Please, enter them
                    below to complete the registration.</p>
            },
            //{
            //    name: 'personal',
            //    title: 'Personal Details'
            //},
            {
                name: 'permissions',
                title: 'Permissions Setup',
                mainTitle: 'Register on Squadintouch',
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
    },
    setStepFunction: function (step, data) {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            password = binding.get('formFields').password,
            username = binding.get('formFields').username,
            currentStep = binding.get('registerStep');

        if (currentStep === 'account') {
            window.Server.login.post({
                username: username,
                password: password
            }).then(function (data) {
                var immutableAccountInfo = Immutable.fromJS(data);
                globalBinding.set('userData.authorizationInfo', immutableAccountInfo);
                binding
                    .atomically()
                    .set('account', Immutable.fromJS(immutableAccountInfo))
                    .merge('formFields', Immutable.fromJS(data.user))
                    .set('registerStep', step)
                    .commit();
            });
        } else {
            binding.set('registerStep', step);
        }
    },
    catchStepFunctionError:function(step, data){
        //Temporary solution to for the 422 error
        //Notify user of the error and allow to try again
        var message,
            responseObj = data.responseJSON.error;
        switch (responseObj.status){
            case 422:
                message = responseObj.details.messages.phone[0];
                alert(message+' - so please try again!');
                break;
            default:
                message = responseObj.message;
                alert(message);
                break;
        }
        $('.bButton').text('Continue →');
    },
    finish: function () {
		var binding = this.getDefaultBinding();

		window.Server.logout.post();
		Helpers.cookie.remove('authorizationInfo');
		binding.sub('authorizationInfo').clear();
		document.location.href = '/';
    },
    renderMainTitle: function (step) {
        var self = this,
            binding = self.getDefaultBinding(),
            currentStep = binding.get('registerStep');
        return <div>
            {self.steps.map(function (step) {
                var stepClasses = classNames({
                    bRegistrationTitle: true,
                    mActive: currentStep === step.name
            });
                return <div className={stepClasses}>{step.mainTitle}</div>;
            })}
        </div>
    },
    renderProgress: function (){
        var self = this,
            binding = self.getDefaultBinding(),
            currentStep = binding.get('registerStep');
                if (currentStep === 'account') {
                 return <div className="eStepComplete" style={{width:20+'px'}}></div>
                }
                else if (currentStep === 'verification') {
                    return <div className="eStepComplete" style={{width:113+'px'}}></div>
                }
                else if (currentStep === 'permissions') {
                    return <div className="eStepComplete" style={{width:208+'px'}}></div>
                }
                else if (currentStep === 'finish') {
                    return <div className="eStepComplete" style={{width:320+'px'}}></div>
                }
    },
    renderSteps: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            currentStep = binding.get('registerStep');

        return <div className="bStepProgress_wrap">
            <div className="bStepProgress">
            {self.steps.map(function (step) {
                var stepClasses = classNames({
                    eStepProgress_progressItem: true,
                    mActive: currentStep === step.name
                });

                return <span className={stepClasses}>{step.title}</span>;
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
                return <div className={descriptionClasses}>{step.description}</div>;
            })}
        </div>;
    },
    render: function () {
        var self = this,
            currentView = null,
            binding = self.getDefaultBinding(),
            currentStep = binding.get('registerStep');
        //currentStep = 'permissions';
        if (currentStep === 'account') {
            currentView =
				<AccountForm
                	onSuccess={self.setStepFunction.bind(null, 'verification')}
                    onError = {self.catchStepFunctionError.bind(null,'verification')}
                	binding={binding.sub('formFields')}
                />
        } else if (currentStep === 'verification') {
            currentView = <VerificationStep
                onSuccess={self.setStepFunction.bind(null, 'permissions')}
                binding={{
                    account: binding.sub('account'),
					formFields: binding.sub('formFields'),
					default: binding.sub('permissionsFields')
				}}
                />
        } else if (currentStep === 'personal') {
            currentView =
				<PersonalForm
                	onSuccess={self.setStepFunction.bind(null, 'permissions')}
                	binding={binding.sub('formFields')}
                />
        } else if (currentStep === 'permissions') {
            currentView =
				<PermissionsList
                	onSuccess={self.setStepFunction.bind(null, 'finish')}
                	binding={{
						//account: binding.sub('account'),
						//formFields: binding.sub('formFields'),
						default: binding
					}}
                />
        } else if (currentStep === 'finish') {
            currentView =
				<RegisterDone
                	onSuccess={self.finish}
                	binding={{default:binding}}
                />
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
