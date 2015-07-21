var ChooseTypeForm = require('module/ui/register/user/choose_type'),
    RegisterForm = require('module/ui/register/user/register_form'),
    RegisterDone = require('module/ui/register/user/register_done'),
    AccountForm = require('module/ui/register/user/account_step'),
    PersonalForm = require('module/ui/register/user/personal_details'),
    PermissionsList = require('module/ui/register/user/permissions_step'),
    VerificationStep = require('module/ui/register/user/verification_step'),
    RegisterUserPage;

RegisterUserPage = React.createClass({
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
                title: 'Account Setup'
            },
            {
                name: 'verification',
                title: 'User Verification'
            },
            {
                name: 'personal',
                title: 'Personal Details'
            },
            {
                name: 'permissions',
                title: 'Permissions Setup'
            },
            {
                name: 'finish',
                title: 'Finish'
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
    finish: function () {
        console.log('finish');
    },
    renderSteps: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            currentStep = binding.get('registerStep');

        return <div className="bStepProgress">
            {self.steps.map(function (step) {
                var stepClasses = classNames({
                    eStepProgress_progressItem: true,
                    mActive: currentStep === step.name
                });

                return <span className={stepClasses}>{step.title}</span>;
            })}
        </div>;
    },
    render: function () {
        var self = this,
            currentView = null,
            binding = self.getDefaultBinding(),
            currentStep = binding.get('registerStep');

        //r3btutu

        if (currentStep === 'account') {
            currentView = <AccountForm
                onSuccess={self.setStepFunction.bind(null, 'verification')}
                binding={binding.sub('formFields')}
                />
        } else if (currentStep === 'verification') {
            currentView = <VerificationStep
                onSuccess={self.setStepFunction.bind(null, 'personal')}
                binding={{
                    account: binding.sub('account'),
					formFields: binding.sub('formFields'),
					default: binding.sub('permissionsFields')
				}}
                />
        } else if (currentStep === 'personal') {
            currentView = <PersonalForm
                onSuccess={self.setStepFunction.bind(null, 'permissions')}
                binding={binding.sub('formFields')}
                />
        } else if (currentStep === 'permissions') {
            currentView = <PermissionsList
                onSuccess={self.setStepFunction.bind(null, 'finish')}
                binding={{
					formFields: binding.sub('formFields'),
					default: binding.sub('permissionsFields')
				}}
                />
        } else if (currentStep === 'finish') {
            currentView = <RegisterDone
                onSuccess={self.finish}
                binding={binding.sub('formFields')}
                />
        }

        return (
            <div className="bRegistration">
                {self.renderSteps()}
                {currentView}
            </div>
        )
    }
});


module.exports = RegisterUserPage;
