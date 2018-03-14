/**
 * Created by Anatoly on 30.07.2016.
 */

import * as React from 'react';

export interface FilterStringTypeProps {
    filterField: {
    	id: string
    	getBadge: () => any,
		onChange: (value: any) => any,
		field: {
    		text: string
		}
	}
}

interface FilterStringTypeState {
    value: any
}

export class FilterStringType extends React.Component<FilterStringTypeProps, FilterStringTypeState> {
    constructor(props) {
        super(props);

        this.state = { value: '' };
    }

	onChange(e){
		const model = this.props.filterField;

		this.setState({value: e.target.value});
		model.onChange.bind(model, e.target.value)();

		e.stopPropagation();
	}

	render() {
		const 	model = this.props.filterField,
				badge = model.getBadge(),
				value = badge && badge.values ? badge.values[0] : '',
				placeholder = 'Enter ' + model.field.text,
				id = model.id ? model.id + '_input' : undefined;

		return (
			<input type="text" className="eFilterTypeString" id={id} value={value} placeholder={placeholder}
				   onChange={(e) => this.onChange(e)} />
		);
	}
}
