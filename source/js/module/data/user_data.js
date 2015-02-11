var DataPrototype = require('module/data/data_prototype'),
	UserDataClass = Object.create(DataPrototype);

/**
 * Получение начального состояния данных UserData
 */
UserDataClass.getDefaultState = function(){
	var self = this,
		defaultState,
		authorizationInfo,
		secondsToLive;

	// Востановлении информации о состоянии авторизации
	authorizationInfo = Helpers.LocalStorage.get('UserData.authorizationInfo') || false;

	if (authorizationInfo) {
		secondsToLive = Math.ceil((authorizationInfo.dieTime - Date.now()) / 1000);

		if (secondsToLive > 0) {
			setTimeout(secondsToLive);
		} else {
			authorizationInfo = false;
		}
	}

	defaultState = {
		authorizationInfo: authorizationInfo
	};

	return defaultState;
};

/**
 * Привязка к изменению данных UserData
 */
UserDataClass.initBind = function() {
	var self = this,
		bindObject = self.bindObject;

	bindObject.addListener('authorizationInfo', function() {
		var data = bindObject.get('authorizationInfo');

		if(data && (data = data.toJS()) && data.id){
			// Сохранение времени смерти сессии
			data.dieTime = Date.now() + data.ttl;
			self.startTTLTimer(data.ttl);

			Helpers.LocalStorage.set('UserData.authorizationInfo', data);
		}
	});
};

/**
 * Запуск таймера окончания сессии
 */
UserDataClass.startTTLTimer = function(secondsToLive) {
	var self = this;

	setTimeout(function() {
		self.bindObject.set('authorizationInfo', false);
		Helpers.LocalStorage.remove('UserData.authorizationInfo');
		document.location.hash = 'login';
	}, secondsToLive * 1000);
};


module.exports = UserDataClass;