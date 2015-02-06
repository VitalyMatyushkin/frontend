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
			binding.set('authorizationInfo', data);
			document.location.hash = 'schools';
		}
	},
	showError: function() {
		var self = this;
		debugger
		self.getDefaultBinding().set('showError', true);
	},
	hideError: function() {
		var self = this;

		self.getDefaultBinding().set('showError', false);
	},
	render: function() {
		var self = this,
			currrentView;

		if (!self.getDefaultBinding().get('showError')) {
			currrentView = <LoginForm onError={self.showError} onSuccess={self.onSuccess} binding={self.getDefaultBinding()} />
		} else {
			currrentView = <LoginError onOk={self.hideError} />
		}

		return (
			<div className="bPageMessage">
				{currrentView}
			</div>
		)
	}
});


module.exports = LoginUserPage;
