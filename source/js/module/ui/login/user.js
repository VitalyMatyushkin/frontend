var LoginForm = require('module/ui/login/user/form'),
	LoginError = require('module/ui/login/user/error'),
	LoginUserPage;

LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount:function(){
		var self = this,
			binding = self.getDefaultBinding(),
			domain = window.location.host.split('.')[0];
		self.formName = domain === 'admin' ? 'Administrator Login' : 'default'; //Injects custom headings for login forms
	},
	getDefaultState: function () {
		return Immutable.Map({
			showError: false
		});
	},
	onSuccess: function(data) {
		var self = this,
			binding = self.getDefaultBinding();

		if(data.id) {
			binding.update('userInfo', function(){
				return Immutable.fromJS(data.user);
			});

			// TODO: попросить Стаса отдавать нормальные данные
			binding.update('authorizationInfo', function(){
				return Immutable.fromJS({
					id: data.id,
					ttl: data.ttl,
					userId: data.userId,
					verified: data.user.verified,
					registerType: data.user.registerType
				});
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
			currentView = <LoginForm customName={self.formName} onError={self.showError} onSuccess={self.onSuccess} binding={self.getDefaultBinding()} />
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
