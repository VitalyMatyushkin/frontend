var LoginForm = require('module/pages/login/user/form'),
	LoginError = require('module/pages/login/user/error'),
	LoginUserPage;

LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.Map({
			showError: false
		});
	},
	onSuccess: function(data) {
		var self = this,
			binding = self.getDefaultBinding();

		if(data.id) {
			binding.update('authorizationInfo', function(){
				return Immutable.Map(data);
			});
		}
	},
	showError: function() {
		var self = this;

		self.getDefaultBinding().set('showError', true);
	},
	hideError: function() {
		var self = this;

		self.getDefaultBinding().set('showError', false);
	},
	onSingUp: function() {
		var self = this;

		document.location.hash = 'register';
		self.hideError();
	},
	render: function() {
		var self = this,
			currentView;

		if (!self.getDefaultBinding().get('showError')) {
			currentView = <LoginForm onError={self.showError} onSuccess={self.onSuccess} binding={self.getDefaultBinding()} />
		} else {
			currentView = <LoginError onOk={self.hideError} onSingUp={self.onSingUp} />
		}

		return (
			<div className="bPageMessage">
				{currentView}
			</div>
		)
	}
});


module.exports = LoginUserPage;
