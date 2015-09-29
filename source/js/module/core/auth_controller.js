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

		// Если появились данные об авторизации
		if (data && data.id) {
			var ttl;
			// Если данные о времени окончании сессии уже присутсвуют
			if (data.dieTime) {
				ttl = Math.ceil((data.dieTime - Date.now()) / 1000);
			} else {
				ttl = data.ttl;
				// Сохранение времени смерти сессии, на случай обновления страницы
				authBinding.set('dieTime', Date.now() + ttl * 1000);
			}

			// Запуск таймера окончания жизни сессия
			if (ttl > 0) {
				self.startTTLTimer(ttl);

				// Получение данных о верификации аккаунта
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
			// Переводим человека на ожидаемую страницу если человек не проходит регистрацию в данный момент
			if (self.binding.get('form.register.formFields') === undefined) {
				document.location.hash = self.nextPage;
			}
		} else if(self.nextPage ==='home'){
            document.location.hash = self.nextPage;  //Bypass authentication
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