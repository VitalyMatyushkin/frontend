/**
 * Created by Anatoly on 20.07.2016.
 */

import {Cell} from './cell';
import * as React from 'react';

export interface RowProps {
    columns: 		any[],
    dataItem:		{
        id: any
        name: any
    },
    handleClick?:	(dataItemId: string, dataItemName: string) => void//The function, which will call when user click on <Row> in Grid
}


export class Row extends React.Component<RowProps, {}> {

	onClickRow() {
		if(this.props.handleClick) {
			this.props.handleClick(this.props.dataItem.id, this.props.dataItem.name);
		}
	}
	
	render() {
		return (
			<div className="eDataList_listItem" onClick={() => this.onClickRow()} >
				{this.props.columns.map((column, index) => {
					/** why index? - for the column key number of sequence is sufficient. */
					return <Cell key={index} column={column} dataItem={this.props.dataItem} />
				})}
			</div>
		);
	}
}
