const	React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		LoginForm		= require('../../ui/login/user/form'),
		LoginError		= require('../../ui/login/user/error'),
		RoleSelector	= require('../../as_login/pages/RoleSelector'),
		SVG				= require('../../ui/svg');

const LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount:function(){
		const domain = window.location.host.split('.')[0];

		this.formName = domain === 'admin' ? 'Administrator Login' : 'default';

		if(this.isAuthorized()) {
			this.setPermissions();
		}
	},
	getDefaultState: function () {
		return Immutable.Map({
			showError: false
		});
	},
	onSuccess: function(data) {
		if(data.id) {
			this.setPermissions();
		}
	},
	showError: function() {
		if(!this.isAuthorized()) {
			this.getDefaultBinding().set('showError', true);
		} else{
			this.setPermissions();
		}
	},
	hideError: function() {
		this.getDefaultBinding().set('showError', false);
	},
	onSingUp: function() {
		document.location.hash = 'register';
		this.hideError();
	},
	setPermissions: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return window.Server.roles.get().then(roleList => binding.set('__allPermissions', roleList));
	},
	isAuthorized: function() {
		return typeof this.getDefaultBinding().toJS("authorizationInfo.userId") !== 'undefined';
	},
	render: function() {
		let currentView;
		
		const	showError		= this.getDefaultBinding().get('showError'),
				allPermissions	= this.getDefaultBinding().get('__allPermissions');

		switch (true) {
			case showError === true:
				currentView = (
					<LoginError	onOk		= {this.hideError}
								onSingUp	= {this.onSingUp}
					/>
				);
				break;
			case showError === false && typeof allPermissions !== 'undefined':
				currentView = <RoleSelector availableRoles={allPermissions}/>;
				break;
			case showError === false:
				currentView = (
					<LoginForm	customName	= {this.formName}
								onError		= {this.showError}
								onSuccess	= {this.onSuccess}
								binding		= {this.getDefaultBinding()}
					/>
				);
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