const 	LoginForm 		= require('module/ui/login/user/form'),
		LoginError 		= require('module/ui/login/user/error'),
		React 			= require('react'),
		Immutable 		= require('immutable'),
		Morearty        = require('morearty'),
		RoleSelector	= require('module/as_login/pages/RoleSelector'),
		SVG 		    = require('module/ui/svg');

const LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount:function(){
		const 	self = this,
				binding = self.getDefaultBinding(),
				domain = window.location.host.split('.')[0];
		self.formName = domain === 'admin' ? 'Administrator Login' : 'default'; //Injects custom headings for login forms

		if(self._isAuthorized()) {
			self._setPermissions();
		}
	},
	getDefaultState: function () {
		return Immutable.Map({
			showError: false
		});
	},
	onSuccess: function(data) {
		console.log('success');

		if(data.id) {
			return this._setPermissions();
		}
        return null;
	},
	showError: function() {
		var self = this;
		if(!self._isAuthorized()) {
			self.getDefaultBinding().set('showError', true);
		}
		else{
			self._setPermissions();
		}
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
	_setPermissions: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return window.Server.roles.get().then(roleList => {
			const presetList = roleList.map(r => r.name);

			binding.set('__allPermissions', presetList);
            return null;
		});
	},
	_isAuthorized: function() {
		const	self	= this,
				userId	= self.getDefaultBinding().toJS("authorizationInfo.userId");

		return typeof userId !== 'undefined';
	},
	render: function() {
		const self = this;
		let currentView;
		const showError = self.getDefaultBinding().get('showError');
		const allPermissions = self.getDefaultBinding().get('__allPermissions');

		switch (true) {
			case showError === true:
				currentView = <LoginError onOk={self.hideError} onSingUp={self.onSingUp} />;
				break;
			case showError === false && typeof allPermissions !== 'undefined':
				console.log('got permissions and ready to draw:' + JSON.stringify(allPermissions));
				currentView = <RoleSelector availableRoles={allPermissions}/>;
				break;
			case showError === false:
				currentView = <LoginForm customName={self.formName} onError={self.showError} onSuccess={self.onSuccess} binding={self.getDefaultBinding()} />
				break;

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
