var TypeText = require('module/ui/form/types/text'),
	TypeArea = require('module/ui/form/types/area'),
	TypeAutocomplete = require('module/ui/form/types/autocomplete'),
	TypeConfirmText = require('module/ui/form/types/confirm_text'),
	TypeDate =  require('module/ui/form/types/date'),
	TypeColors =  require('module/ui/form/types/colors'),
	typeList = {};

// Типы элементов ввода
typeList['text'] = TypeText;
typeList['confirmText'] = TypeConfirmText;
typeList['area'] = TypeArea;
typeList['autocomplete'] = TypeAutocomplete;
typeList['date'] = TypeDate;
typeList['colors'] = TypeColors;

module.exports = typeList;
