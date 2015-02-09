var TypeText = require('module/ui/form/types/text'),
	TypeArea = require('module/ui/form/types/area'),
	TypeConfirmText = require('module/ui/form/types/confirm_text'),
	typeList = {};

// Типы элементов ввода
typeList['text'] = TypeText;
typeList['confirmText'] = TypeConfirmText;
typeList['area'] = TypeArea;

module.exports = typeList;
