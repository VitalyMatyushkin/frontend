var authСontroller;

authСontroller = {
	nextPage: '',
	dieTimer: null,
	/**
	 * Метод обрабатывает появление данных авторизации
	 */
	getNextPage: function() {
		var self = this,
			binding = self.binding,
			activeSchoolId = binding.get('userRules.activeSchoolId'),
			nextSchoolPage = '';

		// Если есть идентефикатор активной школы, показываем страницу школы
		if (activeSchoolId) {
			nextSchoolPage = 'school/summary';
		} else {
			// Если активная школа не задана, отправляем к спику школ
			nextSchoolPage = 'schools';
		}

		return self.nextPage || nextSchoolPage;
	},
	updateAuth: function() {
		var self = this,
			binding = self.binding,
			authBinding = binding.sub('userData.authorizationInfo'),
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
			document.location.hash = self.getNextPage();
		}
	},
	initialize: function(binding) {
		var self = this;

		// Если начальная страница отлична от страница логина, считаем ее следующей после авторизации
		if (document.location.hash !== '#login') {
			self.nextPage = document.location.hash;
		}

		self.binding = binding;
		self.updateAuth();
		binding.addListener('userData.authorizationInfo', self.updateAuth.bind(self));
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