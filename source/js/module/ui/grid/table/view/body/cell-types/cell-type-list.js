/**
 * Created by Anatoly on 21.07.2016.
 */

const 	GeneralType 		= require('./general-type'),
		CustomType 			= require('./custom-type'),
		ActionButtonsType 	= require('./action-buttons-type');

const CellTypeList = {
	'general': 			GeneralType,
	'custom': 			CustomType,
	'action-buttons': 	ActionButtonsType
};

module.exports = CellTypeList;