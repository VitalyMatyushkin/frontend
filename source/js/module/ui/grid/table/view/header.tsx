/**
 * Created by Anatoly on 20.07.2016.
 */

import {HeadCell} from './header/head-cell';
import * as React from 'react';

export interface HeaderProps {
    columns: any[]
}

export class Header extends React.Component<HeaderProps, {}>{
	render() {
		return (
			<div className="eDataList_listItem mHead">
				{this.props.columns.map((column, index) => {
					return <HeadCell key={index} column={column} />
				})}
			</div>
		);
	}
}
