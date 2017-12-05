/**
 * Created by Anatoly on 24.07.2016.
 */

import {FilterField} from './filter-field';
import {BadgeArea} from './badge-area';
import * as	React from 'react';

export interface FilterPanelProps {
    model: any
}

export class FilterPanel extends React.Component<FilterPanelProps, {}> {
	componentWillMount() {
		this.props.model.badgeArea.onChange = this.onChange.bind(this);
	}

	componentWillUnmount() {
		this.props.model.badgeArea.onChange = null;
	}

	onChange() {
		this.setState({renderStart: new Date()});
	}

	render() {
		const 	model 	= this.props.model,
				fields 	= model.filterFields;

		return (
			<div className="bFilterPanel">
				<div className="bFilterFields">
					{fields.map((field, index) => {
						return <FilterField key={index} model={field} />;
					})}
				</div>
				<BadgeArea model={model.badgeArea} />
			</div>
		);
	}
}