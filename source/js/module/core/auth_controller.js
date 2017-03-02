const domainHelper = require('module/helpers/domain_helper');

const authСontroller = {
	nextPage: '',
	_publicPages:['register', 'login', 'reset-request', 'reset'],
	initialize: function(options) {
		var self = this;
		if (!options || !options.binding) {
			console.error('Error while initializing the authorization controller');
		}
		if (self.isPublicPage()) {
			self.defaultPath = options.defaultPath || '#/';
			self.nextPage = self.defaultPath;
		} else {
			self.nextPage = document.location.hash;
		}
		//By pass authentication for public home page for school
		if(options.asSchool === true){
			self.nextPage = options.defaultPath;
		}
		self.binding = options.binding;
		self.updateAuth();
		self.binding.addListener('userData.authorizationInfo', self.updateAuth.bind(self));
		/*
			For reasons unknown the next page property ends up empty sometimes causing login to get stuck
			The condition below tests the properties against an empty string and defaults the value to the
			defaultPath passed to the initialize method of authController
		 */
		if(self.nextPage === ''){self.nextPage = options.defaultPath}
	},
	isPublicPage: function() {
        var self = this,
            path = document.location.hash;

		return self._publicPages.some(function(value){return path.indexOf(value)!== -1;});
	},
	updateAuth: function() {
		var self = this,
			binding = self.binding,
			data = binding.toJS('userData.authorizationInfo'),
            notRegister = !binding.get('form.register.formFields');//user not in registration process now

		// if we got auth data
		if (data && data.id) {
			// redirecting user to awaited page if user not in registration process now and
            // he is a superAdmin or user after become authorization
			if (notRegister && (data.adminId || data.isBecome)) {
				document.location.hash = self.nextPage;
			}
		} else if(self.nextPage ==='loginPublicSchool' || self.nextPage ==='home') {
            document.location.hash = self.nextPage;  //Bypass authentication
        }
		else if(!self.isPublicPage()){
			/*
				Reset hash string to login, if authorisation fails or there is no authorised user,
				avoids users getting stuck if the current hash string is the same as the next one but are presented
				the login view because they are not authenticated.
			 */
			window.location.href = domainHelper.getLoginUrl();
			window.location.reload();
		}
	}
};

module.exports = authСontroller;