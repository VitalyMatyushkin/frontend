const  	TypeText 			= require('module/ui/form/types/text'),
		TypeHidden 			= require('module/ui/form/types/hidden'),
		TypeArea 			= require('module/ui/form/types/area'),
		TypeAutocomplete 	= require('module/ui/form/types/autocomplete'),
		TypeConfirmText 	= require('module/ui/form/types/confirm_text'),
		TypeDate 			= require('module/ui/form/types/date'),
		TypeColors 			= require('module/ui/form/types/colors'),
		TypeSelect 			= require('module/ui/form/types/select'),
		TypeRadio 			= require('module/ui/form/types/radio'),
		TypePhone 			= require('module/ui/form/types/phone'),
		TypeDrop 			= require('module/ui/form/types/dropdown'),
		TypeTextArea 		= require('module/ui/form/types/textarea'),
		TypeFileUpload 		= require('module/ui/form/types/fileType'),
		TypeTermsCheckbox 	= require('module/ui/form/types/terms_checkbox'),
		typeList = {};

// Input element type list
typeList['text'] = TypeText;
typeList['confirmText'] = TypeConfirmText;
typeList['area'] = TypeArea;
typeList['autocomplete'] = TypeAutocomplete;
typeList['date'] = TypeDate;
typeList['colors'] = TypeColors;
typeList['select'] = TypeSelect;
typeList['radio'] = TypeRadio;
typeList['hidden'] = TypeHidden;
typeList['phone'] = TypePhone;
typeList['dropdown'] = TypeDrop;
typeList['textarea'] = TypeTextArea,
typeList['file'] = TypeFileUpload;
typeList['terms'] = TypeTermsCheckbox;

module.exports = typeList;
