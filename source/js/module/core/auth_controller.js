var authСontroller;

authСontroller = {
	afterAuthLocation: '#schools',
	dieTimer: null,
	updateAuth: function() {
		var self = this,
			binding = self.binding,
			authBinding = binding.sub('authorizationInfo'),
			data = authBinding.get();

		// Если появились данные об авторизации
		if(data && (data = data.toJS()) && data.id) {
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
			} else {
				self.clearAuthorization();
			}

			// Переводим человека на ожидаемую страницу
			document.location.hash = self.afterAuthLocation;
		}
	},
	initialize: function(binding) {
		var self = this;

		if (document.location.hash !== '#login') {
			self.afterAuthLocation = document.location.hash || self.afterAuthLocation;
		}

		self.binding = binding;
		self.updateAuth();
		binding.addListener('authorizationInfo', self.updateAuth.bind(self));
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

		self.afterAuthLocation = document.location.hash;
		document.location.hash = '#login';
		self.binding.clear('authorizationInfo');
	}
};

module.exports = authСontroller;