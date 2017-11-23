/**
 * Created by Anatoly on 20.07.2016.
 */

import * as React from 'react';
import {Sort} from './sort';

export interface HeadCellProps {
    column: {
        width:      any
        isSorted:   boolean
        sort:       any
        text:       string
        cell:       {
            dataField: any
        }
    }
}

export class HeadCell extends React.Component<HeadCellProps, {}> {

	render() {
		const 	{column}	= this.props,
				cellStyle 	= column.width ? {width: column.width} : null;

		const sort = column.isSorted ? <Sort dataField={column.cell.dataField} model={column.sort} /> : null;

		return (
			<div className="eDataList_listItemCell" style={cellStyle}>
				{column.text}
				{sort}
			</div>
		)
	}
}
