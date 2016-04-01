const 	DataPrototype 		= require('module/data/data_prototype'),
		Helpers				= require('module/helpers/storage'),
		userRulesInstance 	= Object.create(DataPrototype),
        schoolStorageName 	= 'userRules.activeSchoolId',
        roleStorageName 	= 'userRules.activeRoleId';

/**
 * Получение начального состояния данных userRules
 */
userRulesInstance.getDefaultState = function(){
	var self = this;

	// Востановлении информации об активной школе
	return {
		activeSchoolId: Helpers.LocalStorage.get(schoolStorageName) || null,
        activeRoleId: Helpers.LocalStorage.get(roleStorageName) || null
	};
};

/**
 * Привязка к изменению данных userRules
 */
userRulesInstance.initBind = function() {
	var self = this,
		bindObject = self.bindObject;

    // Автоматически сохраняем данные при смене активной школы
    bindObject.addListener('activeSchoolId', function() {
        var data = bindObject.get('activeSchoolId');

        Helpers.LocalStorage.set(schoolStorageName, data);
    });

    // Автоматически сохраняем данные при смене активной роли
    bindObject.addListener('activeRoleId', function() {
        var data = bindObject.get('activeRoleId');

        Helpers.LocalStorage.set(roleStorageName, data);
    });
};

module.exports = userRulesInstance;