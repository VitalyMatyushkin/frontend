var DataPrototype = require('module/data/data_prototype'),
	UserDataClass = Object.create(DataPrototype);

/**
 * Получение начального состояния данных UserData
 */
UserDataClass.getDefaultState = function(){
	var self = this;

	// Востановлении информации о состоянии авторизации
	return {
		authorizationInfo: Helpers.cookie.get('authorizationInfo') || {}
	};
};

/**
 * Привязка к изменению данных UserData
 */
UserDataClass.initBind = function() {
	var self = this,
		bindObject = self.bindObject;

	// Данные об авторизации мы храним
	bindObject.addListener('authorizationInfo', function() {
		var data = bindObject.get('authorizationInfo'),
			authorizationInfo = data ? data.toJS() : {};

		data && Helpers.cookie.set('authorizationInfo', authorizationInfo);
	});
};

module.exports = UserDataClass;