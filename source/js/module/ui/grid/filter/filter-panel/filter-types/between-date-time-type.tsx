/**
 * Created by Anatoly on 05.12.2016.
 */

import * as React from 'react';
import * as DateTime from 'module/ui/form/types/datetime';
import * as Moment from 'moment';

export interface FilterBetweenDateTimeTypeProps {
    filterField: {
		id: string
		getBadge: () => any
		onChange?: (items: [string, string]) => void
	}
	region?: string
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
				region = this.props.region,
				valueTo = this.getValueTo(),
				values = [value, valueTo] as [string, string];

		this.setState({values:values});

		model.onChange([this.getRequestValueForRegion(value, region), valueTo] as [string, string]);
	}

	getValueFrom(): string {
		const 	model = this.props.filterField,
				badge = model.getBadge(),
				valueFrom = badge && badge.values && badge.values.length > 0 ? badge.values[0] : '';

		return valueFrom;
	}

	onChangeTo(value: string): void {
		const   model = this.props.filterField,
				region = this.props.region,
				valueFrom = this.getValueFrom(),
				values = [valueFrom, value] as [string, string];

		this.setState({values:values});

		model.onChange([valueFrom, this.getRequestValueForRegion(value, region)] as [string, string]);
	}

	getValueForRegion(value: string, region: string): string {
		return region === 'US' ?  Moment(value as string, 'YYYY-DD-MM HH:mm').format('YYYY-MM-DD HH:mm') :
			value;
	}

	getRequestValueForRegion(value: string, region: string): string {
		return region === 'US' && Moment(value as string, 'YYYY-DD-MM HH:mm', true).isValid() ?
			Moment(value, 'YYYY-DD-MM HH:mm').format('YYYY-MM-DD HH:mm') : value;
	}

	render() {
		const   region = this.props.region;
		let     valueFrom = this.getValueFrom(),
				valueTo = this.getValueTo();

		valueFrom = this.getValueForRegion(valueFrom as string, region);
		valueTo = this.getValueForRegion(valueTo as string, region);

		return (
			<div className="eBetweenDateTime">
				<label>from</label><DateTime region={region} value={valueFrom} onBlur={value => this.onChangeFrom(value)} />
				<label>to</label><DateTime region={region} value={valueTo} onBlur={value => this.onChangeTo(value)} />
			</div>
		);
	}
}

