/**
 * Created by Anatoly on 30.07.2016.
 */

import {FilterTypeList} from './filter-types/filter-type-list';
import * as	React from 'react';

export interface FilterFieldProps {
    model: any
}

export class FilterField extends React.Component<FilterFieldProps, {}> {

	render() {
		const 	model 			= this.props.model,
				FilterFieldType = FilterTypeList[model.type];

		return (
			<div className="bFilterField">
				<div className="eField">{model.field.text}</div>
				<div className="eFilterContainer">
					<FilterFieldType filterField={model} />
				</div>
			</div>
		);
	}
}