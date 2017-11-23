/**
 * Created by Anatoly on 19.07.2016.
 */

import * as React from 'react';
import {Header} from './header';
import {Row} from './body/row';

export interface TableProps {
	model: {
		data: any[],		// data.id not declared in type because I don't know how
		columns: any[]
	},
	handleClick: (dataItemId: string, dataItemName: string) => void	//The function, which will call when user click on <Row> in Grid
}

export class Table extends React.Component<TableProps, {}> {
	render(){
		const {model} = this.props;
		const {data, columns} = model;

		return (
			<div className="eDataList_list mTable">
				<Header columns={model.columns} />
				{data && data.length ? data.map((item, index) => {
					return <Row
								handleClick	={ this.props.handleClick }
								key			={ item.id ? item.id : index }
								dataItem	={ item }
								columns		={ columns }
							/>
				}) : null}
			</div>
		)
	}
}
