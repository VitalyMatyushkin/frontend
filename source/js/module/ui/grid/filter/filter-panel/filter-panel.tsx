/**
 * Created by Anatoly on 24.07.2016.
 */

import {FilterField, FilterFieldProps} from './filter-field';
import {BadgeArea} from './badge-area';
import * as	React from 'react';
import {BadgeAreaModel} from "module/ui/grid/filter/model/badge-area-model";

export interface FilterPanelProps {
    model: {
    	badgeArea: BadgeAreaModel
		filterFields: any[]
	}
	region?: string
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
				region 	= this.props.region,
				fields 	= model.filterFields;

		return (
			<div className="bFilterPanel">
				<div className="bFilterFields">
					{fields.map((field, index) => {
						return <FilterField key={index} model={field} region={region}/>;
					})}
				</div>
				<BadgeArea model={model.badgeArea} region={region}/>
			</div>
		);
	}
}