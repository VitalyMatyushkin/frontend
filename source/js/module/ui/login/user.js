const 	LoginForm 		= require('module/ui/login/user/form'),
		LoginError 		= require('module/ui/login/user/error'),
		React 			= require('react'),
		Immutable 		= require('immutable'),
		Morearty        = require('morearty'),
		{SVG} 		    = require('module/ui/svg');

const LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount:function(){
		const 	self 	= this,
				binding = self.getDefaultBinding(),
				domain 	= window.location.host.split('.')[0];		// TODO: maybe it is better to store all required data in some other place ?
		self.formName = domain === 'admin' ? 'Administrator Login' : 'default'; //Injects custom headings for login forms
	},
	getDefaultState: function () {
		return Immutable.Map({
			showError: false
		});
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
			currentView = <LoginForm customName={self.formName} onError={self.showError} binding={self.getDefaultBinding()} />
		} else {
			currentView = <LoginError onOk={self.hideError} onSingUp={self.onSingUp} />
		}

		return (
			<div className="bPageMessage">
				<SVG classes="bLoginIcon" icon="icon_login"/>
				{currentView}
			</div>
		)
	}
});


module.exports = LoginUserPage;
