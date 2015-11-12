var authСontroller;

authСontroller = {
	nextPage: '',
	dieTimer: null,
	initialize: function(options) {
		var self = this;
		if (!options || !options.binding) {
			console.error('Error while initializing the authorization controller');
		}

		if (self.isLoginPage()) {
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
	isLoginPage: function() {
		return document.location.hash && document.location.hash.indexOf('login') !== -1;
	},
	updateAuth: function() {
		var self = this,
			binding = self.binding,
			authBinding = binding.sub('userData.authorizationInfo'),
			userInfoBinding = binding.sub('userData.userInfo'),
			data = binding.toJS('userData.authorizationInfo'),
			userData = binding.toJS('userData.userInfo');

		// if we got auth data
		if (data && data.id) {
			var ttl;
			// if there is data about session die time
			if (data.dieTime) {
				ttl = Math.ceil((data.dieTime - Date.now()) / 1000);
			} else {
				ttl = data.ttl;
				// saving session die time for the refresh page case
				authBinding.set('dieTime', Date.now() + ttl * 1000);
			}

			// Starting session die timer
			if (ttl > 0) {
				self.startTTLTimer(ttl);

				// getting data about account verification
				/*
				if (!userData || !userData.user || !userData.user.verified) {
					window.Server.user.get(data.userId).then(function (data) {
						userInfoBinding.merge(true, Immutable.fromJS(data));
					});
				}
				*/

			} else {
				self.clearAuthorization();
			}
			// redirecting user to awaited page if user not in registration process now
			if (self.binding.get('form.register.formFields') === undefined) {
				document.location.hash = self.nextPage;
			}
		} else if(self.nextPage ==='home'){
            document.location.hash = self.nextPage;  //Bypass authentication
        }
		else{
			/*
				Reset hash string to login, if authorisation fails or there is no authorised user,
				avoids users getting stuck if the current hash string is the same as the next one but are presented
				the login view because they are not authenticated.
			 */
			document.location.hash = '#login';
		}
	},
	startTTLTimer: function(secondsToLive) {
		var self = this;

		clearTimeout(self.dieTimer);
		self.dieTimer = setTimeout(function() {
			self.clearAuthorization();
		}, secondsToLive * 1000);
	},
	clearAuthorization: function() {
		var self = this;

		self.nextPage = document.location.hash;
		document.location.hash = '#login';
		self.binding.clear('userData.authorizationInfo');
	}
};

module.exports = authСontroller;