/**
 * Created by Anatoly on 30.07.2016.
 */

const 	StringType 				= require('./string-type'),
		BetweenDateType 		= require('./between-date-type'),
		FilterMultiSelectType 	= require('./multiselect-type');

const FilterTypeList = {
	'string': 		StringType,
	'between-date':	BetweenDateType,
	'multi-select': FilterMultiSelectType
};

module.exports = FilterTypeList;