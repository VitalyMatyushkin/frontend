/**
 * Created by Anatoly on 21.07.2016.
 */

import * as React from 'react';
import {DateHelper} from "module/helpers/date_helper";

export interface DateTypeProps {
    cell: 		any
    dataItem:	any
}

export class DateType extends React.Component<DateTypeProps, {}> {

	render() {
		const 	value	= this.props.cell.getValue(this.props.dataItem),
				result	= value ? DateHelper.toLocalWithMonthName(value) : null;

		return (
			<div className="eDataList_listItemCell">
				{result}
			</div>
		);
	}
}
