/**
 * Created by Anatoly on 31.07.2016.
 */

import * as React from 'react';
import {DateHelper} from 'module/helpers/date_helper';
import {BadgeModel} from "../model/badge-model";


export interface BadgeProps {
    model: 	BadgeModel
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
		const values = this.props.model.values;
		let result = '';

		result += values[0] ? 'from ' + DateHelper.toLocal(values[0]) + ' ' : '';
		result += values[1] ? 'to ' + DateHelper.toLocal(values[1]) : '';

		return result;
	}

	_getBetweenDateTimeValue(): string {
		const values = this.props.model.values;
		let result = '';

		result += values[0] ? 'from ' + DateHelper.toLocalDateTime(values[0]) + ' ' : '';
		result += values[1] ? 'to ' + DateHelper.toLocalDateTime(values[1]) : '';

		return result;
	}
	_getKeyValuePairs(): string {
		const values = this.props.model.values;

		return values.map(item => item.value).join(', ');
	}
}