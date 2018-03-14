/**
 * Created by Anatoly on 30.07.2016.
 */



import {FilterStringType} from './filter-types/string-type';
import {FilterBetweenDateType} from './filter-types/between-date-type';
import {FilterBetweenDateTimeType} from './filter-types/between-date-time-type';
import {FilterMultiSelectType} from './filter-types/multiselect-type';
import * as	React from 'react';

export interface FilterFieldModel {
	id: string
	typeOptions: any
	getBadge: () => any
	type: 'string' | 'between-date' | 'between-date-time' | 'multi-select',
	field: {
		text: string
	}
}

export interface FilterFieldProps {
	id?: string,
    model: FilterFieldModel
}

export const FilterTypeList = {
	'string':				FilterStringType,
	'between-date':			FilterBetweenDateType,
	'between-date-time':	FilterBetweenDateTimeType,
	'multi-select':			FilterMultiSelectType
};

export class FilterField extends React.Component<FilterFieldProps, {}> {

	render() {
		const 	{model}			= this.props,
				id				= model.id ? model.id + '_title' : undefined,
				FilterFieldType = FilterTypeList[model.type];

		return (
			<div className="bFilterField">
				<div className="eField" id={id}>{model.field.text}</div>
				<div className="eFilterContainer">
					<FilterFieldType filterField={model} />
				</div>
			</div>
		);
	}
}