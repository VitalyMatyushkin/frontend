const 	DataPrototype 		= require('module/data/data_prototype'),
		Helpers				= require('module/helpers/storage'),
		userRulesInstance 	= Object.create(DataPrototype),
        schoolStorageName 	= 'activeSchoolId';

/**
 * Получение начального состояния данных userRules
 */
userRulesInstance.getDefaultState = function(){
	var self = this;

	// Востановлении информации об активной школе
	return {
		activeSchoolId: Helpers.cookie.get(schoolStorageName) || null
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

        Helpers.cookie.set(schoolStorageName, data);
    });
};

module.exports = userRulesInstance;