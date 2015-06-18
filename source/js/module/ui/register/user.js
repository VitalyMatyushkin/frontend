var ChooseTypeForm = require('module/ui/register/user/choose_type'),
	RegisterForm = require('module/ui/register/user/register_form'),
	RegisterDone = require('module/ui/register/user/register_done'),
	RegisterUserPage;

RegisterUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	// TODO: вынести значение поля step в мета-данные
	getDefaultState: function () {
		return Immutable.Map({
			registerStep: 'type'
		});
	},
	setStepFunction: function(step) {
		var self = this;

		return function(){
			self.getDefaultBinding().set('registerStep', step);
		};
	},
	render: function() {
		var self = this,
			currentView,
			binding = self.getDefaultBinding(),
			currentStep = binding.get('registerStep');

		switch(currentStep) {
			case 'type':
				currentView = <ChooseTypeForm onSuccess={self.setStepFunction('form')} binding={binding.sub('formFields')} />;
				break;
			case 'form':
				currentView = <RegisterForm onSuccess={self.setStepFunction('done')} binding={binding.sub('formFields')} />;
				break;
			case 'done':
				currentView = <RegisterDone binding={binding.sub('formFields')} />;
				break;
		}

		return (
			<div>
				{currentView}
			</div>
		)
	}
});


module.exports = RegisterUserPage;
