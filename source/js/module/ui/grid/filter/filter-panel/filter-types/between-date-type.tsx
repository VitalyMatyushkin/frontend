/**
 * Created by Anatoly on 30.07.2016.
 */

import * as React from 'react';
import * as Date from 'module/ui/form/types/date';
import * as Moment from 'moment';

interface Badge {
	values: Array<{ key: string }>
}

export interface FilterBetweenDateTypeProps {
    filterField: {
    	id: string
		getBadge: () => Badge
		onChange?: (items: [string, string]) => void
	}
	region?: string
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
				region  = this.props.region,
				badge   = model.getBadge(),
				valueTo = badge && badge.values && badge.values.length === 2 ? badge.values[1] : '',
				values  = [value, valueTo] as [string, string];

		this.setState({values: values});

		model.onChange([this.getRequestValueForRegion(value, region), valueTo] as [string, string]);
	}

	onChangeTo(value: string): void {
		const 	model       = this.props.filterField,
				region      = this.props.region,
                badge       = model.getBadge(),
                valueFrom   = badge && badge.values && badge.values.length > 0 ? badge.values[0] : '',
                values      = [valueFrom, value] as [string, string];

		this.setState({values:values});

		model.onChange([valueFrom, this.getRequestValueForRegion(value, region)] as [string, string]);
	}

	getValueForRegion(value: string, region: string): string {
		return region === 'US' ?  Moment(value as string, 'YYYY-DD-MM').format('YYYY-MM-DD') :
			value;
	}

	getRequestValueForRegion(value: string, region: string): string {
		return region === 'US' && Moment(value, 'YYYY-DD-MM', true).isValid() ?
			Moment(value, 'YYYY-DD-MM').format('YYYY-MM-DD') : value;
	}

	render() {
		const 	model       = this.props.filterField,
				region      = this.props.region,
				id          = model.id,
				badge       = model.getBadge();
		let	    valueFrom   = badge && badge.values && badge.values.length > 0 ? badge.values[0] : '',
				valueTo     = badge && badge.values && badge.values.length === 2 ? badge.values[1] : '';

		valueFrom = this.getValueForRegion(valueFrom as string, region);
		valueTo = this.getValueForRegion(valueTo as string, region);

		return (
			<div className="eBetweenDate" id={id}>
				<label>from</label><Date value={valueFrom} region={region} onBlur={dateStr => this.onChangeFrom(dateStr)} />
				<label>to</label><Date value={valueTo} region={region} onBlur={dateStr => this.onChangeTo(dateStr)} />
			</div>
		);
	}
}
