/**
 * Created by Anatoly on 31.07.2016.
 */

import * as React from 'react';
import * as Moment from 'moment';
import {BadgeModel} from "../model/badge-model";


export interface BadgeProps {
    model: 	BadgeModel
	region?: string
}

export class Badge extends React.Component<BadgeProps, {}> {

	render() {
		const 	model = this.props.model,
				value = this.getValue(),
				classes = 'bBadge mType-' + model.type;

		return (
			<div className={classes} >
				<span className="eField">{model.field.text}</span>
				<span className="eValue">{value}</span>
				<span className="eDelete" onClick={model.onDelete.bind(model)}>&#10060;</span>
			</div>
		);
	}

	getValue(): string {
		const model = this.props.model;

		switch (model.type){
			case 'between-date':
				return this._getBetweenDateValue();
			case 'between-date-time':
				return this._getBetweenDateTimeValue();
			case 'multi-select':
				return this._getKeyValuePairs();
			default:
				return this._getDefaultValue();
		}
	}

	_getDefaultValue(){
		return this.props.model.values[0];
	}

	_getBetweenDateValue(): string {
		const   values = this.props.model.values,
				region = this.props.region;

		let result = '';

		result += values[0] ? 'from ' + (region === 'US' ? Moment(values[0]).format('MM.DD.YYYY') : Moment(values[0]).format('DD.MM.YYYY/HH:mm')) + ' ' : '';
		result += values[1] ? 'to ' + (region === 'US' ? Moment(values[1]).format('MM.DD.YYYY') :Moment(values[1]).format('DD.MM.YYYY/HH:mm')) : '';

		return result;
	}

	_getBetweenDateTimeValue(): string {
		const   values = this.props.model.values,
				region = this.props.region;

		let result = '';

		result += values[0] ? 'from ' + (region === 'US' ? Moment(values[0]).format('MM.DD.YYYY/HH:mm') : Moment(values[0]).format('DD.MM.YYYY/HH:mm')) + ' ' : '';
		result += values[1] ? 'to ' + (region === 'US' ? Moment(values[1]).format('MM.DD.YYYY/HH:mm') : Moment(values[1]).format('DD.MM.YYYY/HH:mm')) : '';

		return result;
	}
	_getKeyValuePairs(): string {
		const values = this.props.model.values;

		return values.map(item => item.value).join(', ');
	}
}