import * as React from 'react';

import {Sport} from './sport'
import {ReactNode} from "react";

interface SportListManagerProps {
	sportList: 			Sport[],
	onClickRow: 		(index: number) => void,
	title: 				string
}

export class SportListManager extends React.Component<SportListManagerProps, {}> {
	renderTableBody(): ReactNode {
		return this.props.sportList.map( (sport, index) => {
			return (
				<tr style={{cursor: 'pointer'}} key = {index} onClick = {() => this.props.onClickRow(index)}>
					<td>{ index + 1 }</td>
					<td>{ sport.name }</td>
				</tr>
			);
		});
	}
	render() {
		return (
			<div className="bSportsListManagerWrapper">
				<div className="bSportsListManagerTitle">{this.props.title}</div>
				<div className="bSportsListManager">
					<table className="table table-hover bSportsListManagerTable">
						<thead className="bSportsListManagerTableHead">
						<tr>
							<th>#</th>
							<th>Name</th>
						</tr>
						</thead>
						<tbody className="bSportsListManagerTableBody">
						{ this.renderTableBody() }
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
