var ChooseTypeForm = require('module/ui/register/user/choose_type'),
	RegisterForm = require('module/ui/register/user/register_form'),
	RegisterDone = require('module/ui/register/user/register_done'),
	RegisterUserPage;

RegisterUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	// TODO: вынести значение поля step в мета-данные
	getDefaultState: function () {
		return Immutable.Map({
			registerType: '',
			registerStep: 'done'
		});
	},
	onRegisterSuccess: function() {
		var self = this;

		self.getDefaultBinding().set('registerStep', 'done');
	},
	onDone: function() {
		var self = this;


	},
	render: function() {
		var self = this,
			currentView,
			currentStep = self.getDefaultBinding().get('registerStep');

		switch(currentStep) {
			case 'type':
				currentView = <ChooseTypeForm binding={self.getDefaultBinding()} />;
				break;
			case 'form':
				currentView = <RegisterForm onSuccess={self.onRegisterSuccess} binding={self.getDefaultBinding()} />;
				break;
			case 'done':
				currentView = <RegisterDone />;
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
