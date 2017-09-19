const	React				= require('react'),
		Immutable			= require('immutable'),
		Morearty			= require('morearty'),
		bowser 				= require('bowser'),
		LoginForm			= require('../../ui/login/user/form'),
		LoginError			= require('../../ui/login/user/error'),
		RoleSelector		= require('../../as_login/pages/RoleSelector'),
		ApplicationLinks 	= require('../../ui/application_links/application_links'),
		ApplicationConst	= require('module/helpers/consts/application_links'),
		SessionHelper		= require('module/helpers/session_helper'),
		SVG					= require('../../ui/svg');

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
	onSuccess: function() {
		if(this.isAuthorized()) {
			this.setPermissions();
		}
	},
	showError: function() {
		if(this.isAuthorized()) {
			this.setPermissions();
		} else{
			this.getDefaultBinding().set('showError', true);
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
		return typeof SessionHelper.getUserIdFromSession(
			this.getDefaultBinding()
		) !== 'undefined';
	},
	renderCurrentView: function(){
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
		return currentView;
	},
	isFirstVisitFromMobile: function(){
		const isFirstVisit = typeof this.getDefaultBinding().get('isFirstVisit') === 'undefined';
		return isFirstVisit && bowser.mobile;
	},
	onClickWebVersion: function(){
		const binding = this.getDefaultBinding();
		binding.set('isFirstVisit', false);
	},
	onClickIOSVersion: function (){
		window.open(ApplicationConst.APPLICATION_LINKS.IOS);
	},
	onClickAndroidVersion: function (){
		window.open(ApplicationConst.APPLICATION_LINKS.ANDROID);
	},
	render: function() {
		if (this.isFirstVisitFromMobile()) {
			return (
			<div className="bPageMessage">
				<SVG classes="bLoginIcon" icon="icon_login"/>
					<ApplicationLinks
						onClickWebVersion 		= {this.onClickWebVersion}
						onClickIOSVersion 		= {this.onClickIOSVersion}
						onClickAndroidVersion 	= {this.onClickAndroidVersion}
					/>
			</div>
			);
		} else {
			return (
				<div className="bPageMessage">
					<SVG classes="bLoginIcon" icon="icon_login"/>
					{this.renderCurrentView()}
				</div>
			)
		}
	}
});

module.exports = LoginUserPage;