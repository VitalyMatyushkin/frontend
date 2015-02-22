var TypeText = require('module/ui/form/types/text'),
	TypeArea = require('module/ui/form/types/area'),
	TypeAutocomplete = require('module/ui/form/types/autocomplete'),
	TypeConfirmText = require('module/ui/form/types/confirm_text'),
	typeList = {};

// Типы элементов ввода
typeList['text'] = TypeText;
typeList['confirmText'] = TypeConfirmText;
typeList['area'] = TypeArea;
typeList['autocomplete'] = TypeAutocomplete;

module.exports = typeList;
