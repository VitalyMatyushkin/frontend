var RegisterCoach = require('module/ui/register/user/form_coach'),
	RegisterOfficial = require('module/ui/register/user/form_official'),
	RegisterParent = require('module/ui/register/user/form_parent'),
	RegisterDone = require('module/ui/register/user/done'),
	FormStep = require('module/ui/register/user/form_step'),
	RegiseterUserPage;

RegiseterUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	// TODO: вынести значение поля step в мета-данные
	getDefaultState: function () {
		return Immutable.Map({
			step: 'choose_type'
		});
	},
	onSuccess: function() {
		var self = this;

		self.getDefaultBinding().set('step', 'choose_type');
	},
	onDone: function() {
		var self = this;

		self.getDefaultBinding().set('step', 'done');
	},
	render: function() {
		var self = this,
			currentView,
			currentStep = self.getDefaultBinding().get('step');

		switch(currentStep) {
			case 'choose_type':
				currentView = <FormStep binding={self.getDefaultBinding()} />;
				break;
			case 'as_parent':
				currentView = <RegisterParent onSuccess={self.onSuccess} binding={self.getDefaultBinding()} />;
				break;
			case 'as_coach':
				currentView = <RegisterCoach onSuccess={self.onSuccess} binding={self.getDefaultBinding()} />;
				break;
			case 'as_official':
				currentView = <RegisterOfficial onSuccess={self.onSuccess} binding={self.getDefaultBinding()} />;
				break;
			case 'done':
				currentView = <RegisterDone onSingin={self.onDone} />;
				break;
		}

		return (
			<div>
				{currentView}
			</div>
		)
	}
});


module.exports = RegiseterUserPage;
