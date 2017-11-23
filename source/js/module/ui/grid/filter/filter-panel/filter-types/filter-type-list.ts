/**
 * Created by Anatoly on 30.07.2016.
 */



import {FilterStringType} from './string-type';
import {FilterBetweenDateType} from './between-date-type';
import {FilterBetweenDateTimeType} from './between-date-time-type';
import {FilterMultiSelectType} from './multiselect-type';

export const FilterTypeList = {
	'string':				FilterStringType,
	'between-date':			FilterBetweenDateType,
	'between-date-time':	FilterBetweenDateTimeType,
	'multi-select':			FilterMultiSelectType
};