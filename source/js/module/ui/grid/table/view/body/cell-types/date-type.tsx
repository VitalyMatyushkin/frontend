/**
 * Created by Anatoly on 21.07.2016.
 */

import * as React from 'react';
import {DateHelper} from 'module/helpers/date_helper';

export interface DateTypeProps {
    cell: 		any
    dataItem:	any
	region?:    string
}

export class DateType extends React.Component<DateTypeProps, {}> {

	render() {
		const 	value	= this.props.cell.getValue(this.props.dataItem),
				region  = this.props.region,
				result	= value ? DateHelper.getLongDateStringByRegion(value, region) : null;

		return (
			<div className="eDataList_listItemCell">
				{result}
			</div>
		);
	}
}
