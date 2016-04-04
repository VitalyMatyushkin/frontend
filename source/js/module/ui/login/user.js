const 	LoginForm 		= require('module/ui/login/user/form'),
		LoginError 		= require('module/ui/login/user/error'),
		React 			= require('react'),
		Immutable 		= require('immutable'),
		SVG 		    = require('module/ui/svg');

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
	onSuccess: function(data) {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding(),	//Collect all user role arrays from @args {Object} data and assign to roleObject
				roleObject 		= {
					admin:		data.user.admins,
					coach:		data.user.coaches,
					teacher:	data.user.teachers,
					manager:	data.user.managers
				};


		//Iterate over roleObject keys to find the array with length greater than one as
		//that determines the user's role
		//If found assign the key to a @path {string} currentUserRole in the global morearty context
		//TODO: this would need modification once data structure at backend is restructured - temporary fix (know the role of current user)
		for(var key in roleObject){
			if(roleObject[key].length >= 1){
				globalBinding.set('currentUserRole',key);
				break;
			}
		}
		//If there were no roles default to admin
		//TODO: this is implemented this way because admin tend to have preset (owner) - future refactoring
		if(globalBinding.get('currentUserRole')=== undefined){
			globalBinding.set('currentUserRole','admin');
		}
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
				<SVG classes="bLoginIcon" icon="icon_login"/>
				{currentView}
			</div>
		)
	}
});


module.exports = LoginUserPage;
