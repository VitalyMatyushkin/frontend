var authСontroller;

authСontroller = {
	nextPage: '',
	dieTimer: null,
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
			// Переводим человека на ожидаемую страницу
            //Checks if the user is verified on client side. True directs to relevant page; False directs to settings page
            if(typeof userData !== 'undefined'){
                if(userData.verified.email === false && userData.verified.phone === false){
                    document.location.hash = 'settings/general';
                }else{
                    document.location.hash = self.nextPage;
                }
            }else{
                document.location.hash = self.nextPage;
            }
		}
	},
	initialize: function(options) {
		var self = this;

		if (!options || !options.binding) {
			console.error('Error while initializing the authorization controller');
		}

		// Если начальная страница отлична от страница логина, считаем ее следующей после авторизации
		if (document.location.hash && document.location.hash.indexOf('login') === -1) {
			self.nextPage = document.location.hash;
		} else {
			self.defaultPath = options.defaultPath || '#/';
			self.nextPage = self.defaultPath;
		}

		self.binding = options.binding;

		self.updateAuth();
		self.binding.addListener('userData.authorizationInfo', self.updateAuth.bind(self));
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