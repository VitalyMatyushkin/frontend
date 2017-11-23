/**
 * Created by Anatoly on 30.07.2016.
 */

import * as React from 'react';
import * as Date from 'module/ui/form/types/date';


export interface FilterBetweenDateTypeProps {
    filterField: any
}

interface FilterBetweenDateTypeState {
    values?: [string, string]
}

export class FilterBetweenDateType extends React.Component<FilterBetweenDateTypeProps, FilterBetweenDateTypeState> {
	constructor(props) {
	    super(props);

	    this.state = { values: null };
    }

	onChangeFrom(value: string): void {
		const 	model   = this.props.filterField,
				badge   = model.getBadge(),
				valueTo = badge && badge.values && badge.values.length === 2 ? badge.values[1] : '',
				values  = [value, valueTo] as [string, string];

		this.setState({values:values});

		model.onChange(values);
	}

	onChangeTo(value: string): void {
		const 	model       = this.props.filterField,
                badge       = model.getBadge(),
                valueFrom   = badge && badge.values && badge.values.length > 0 ? badge.values[0] : '',
                values      = [valueFrom, value] as [string, string];

		this.setState({values:values});

		model.onChange(values);
	}

	render() {
		const 	model       = this.props.filterField,
				id          = model.id,
				badge       = model.getBadge(),
				valueFrom   = badge && badge.values && badge.values.length > 0 ? badge.values[0] : '',
				valueTo     = badge && badge.values && badge.values.length === 2 ? badge.values[1] : '';

		return (
			<div className="eBetweenDate" id={id}>
				<label>from</label><Date value={valueFrom} onBlur={dateStr => this.onChangeFrom(dateStr)} />
				<label>to</label><Date value={valueTo} onBlur={dateStr => this.onChangeTo(dateStr)} />
			</div>
		);
	}
}
