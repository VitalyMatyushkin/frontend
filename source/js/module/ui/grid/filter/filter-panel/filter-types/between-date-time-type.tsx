/**
 * Created by Anatoly on 05.12.2016.
 */

import * as React from 'react';
import * as DateTime from 'module/ui/form/types/datetime';

export interface FilterBetweenDateTimeTypeProps {
    filterField: any
}

interface FilterBetweenDateTimeTypeState {
    values?: [string, string]
}

export class FilterBetweenDateTimeType extends React.Component<FilterBetweenDateTimeTypeProps, FilterBetweenDateTimeTypeState> {
	constructor(props) {
	    super(props);
	    this.state = { values: null };
    }

	getValueTo(): string {
		const 	model = this.props.filterField,
				badge = model.getBadge(),
				valueTo = badge && badge.values && badge.values.length === 2 ? badge.values[1] : '';

		return valueTo;
	}

	onChangeFrom(value: string): void {
		const 	model = this.props.filterField,
				valueTo = this.getValueTo(),
				values = [value, valueTo] as [string, string];

		this.setState({values:values});

		model.onChange(values);
	}

	getValueFrom(): string {
		const 	model = this.props.filterField,
				badge = model.getBadge(),
				valueFrom = badge && badge.values && badge.values.length > 0 ? badge.values[0] : '';

		return valueFrom;
	}

	onChangeTo(value: string): void {
		const   model = this.props.filterField,
				valueFrom = this.getValueFrom(),
				values = [valueFrom, value] as [string, string];

		this.setState({values:values});

		model.onChange(values);
	}

	render() {
		const   valueFrom = this.getValueFrom(),
				valueTo = this.getValueTo();

		return (
			<div className="eBetweenDateTime">
				<label>from</label><DateTime value={valueFrom} onBlur={value => this.onChangeFrom(value)} />
				<label>to</label><DateTime value={valueTo} onBlur={value => this.onChangeTo(value)} />
			</div>
		);
	}
}

