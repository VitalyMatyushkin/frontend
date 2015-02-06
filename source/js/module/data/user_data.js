var DataPrototype = require('module/data/data_prototype'),
	UserDataClass = Object.create(DataPrototype);

/**
 * Получение начального состояния данных UserData
 */
UserDataClass.getDefaultState = function(){
	var self = this,
		defaultState,
		authorizationInfo;

	// Востановлении информации о состоянии авторизации
	authorizationInfo = Helpers.LocalStorage.get('UserData.authorizationInfo') || false;

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
		var authorizationInfo = bindObject.get('authorizationInfo');

		if(authorizationInfo && authorizationInfo.id){
			Helpers.LocalStorage.set('UserData.authorizationInfo', authorizationInfo);
		}
	});
};



module.exports = UserDataClass;