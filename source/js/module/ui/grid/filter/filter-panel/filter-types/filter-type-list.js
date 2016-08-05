/**
 * Created by Anatoly on 30.07.2016.
 */

const 	StringType 		= require('./string-type'),
		BetweenDateType = require('./between-date-type');

const FilterTypeList = {
	'string': 		StringType,
	'between-date':	BetweenDateType
};

module.exports = FilterTypeList;