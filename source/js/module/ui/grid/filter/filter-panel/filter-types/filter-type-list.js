/**
 * Created by Anatoly on 30.07.2016.
 */

const 	StringType 					= require('./string-type'),
		BetweenDateType 				= require('./between-date-type'),
		BetweenDateTimeType			= require('./between-date-time-type'),
		FilterMultiSelectType 	= require('./multiselect-type');

const FilterTypeList = {
	'string'						: StringType,
	'between-date'			:	BetweenDateType,
	'between-date-time'	: BetweenDateTimeType,
	'multi-select'			: FilterMultiSelectType
};

module.exports = FilterTypeList;