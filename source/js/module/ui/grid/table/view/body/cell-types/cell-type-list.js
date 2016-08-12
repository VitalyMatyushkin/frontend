/**
 * Created by Anatoly on 21.07.2016.
 */

const 	GeneralType 		= require('./general-type'),
		CustomType 			= require('./custom-type'),
		GenderType 			= require('./gender-type'),
		DateType 			= require('./date-type'),
		ActionButtonsType 	= require('./action-buttons-type');

const CellTypeList = {
	'general': 			GeneralType,
	'custom': 			CustomType,
	'gender': 			GenderType,
	'date': 			DateType,
	'action-buttons': 	ActionButtonsType
};

module.exports = CellTypeList;