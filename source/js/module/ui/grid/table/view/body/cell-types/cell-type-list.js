/**
 * Created by Anatoly on 21.07.2016.
 */

const 	GeneralType 		= require('./general-type'),
		CustomType 			= require('./custom-type'),
		ColorsType 			= require('./colors-type'),
		GenderType 			= require('./gender-type'),
		DateType 			= require('./date-type'),
		ImageType 			= require('./image-type'),
		ActionButtonsType 	= require('./action-buttons-type');

const CellTypeList = {
	'general': 			GeneralType,
	'custom': 			CustomType,
	'colors': 			ColorsType,
	'gender': 			GenderType,
	'date': 			DateType,
	'image': 			ImageType,
	'action-buttons': 	ActionButtonsType
};

module.exports = CellTypeList;