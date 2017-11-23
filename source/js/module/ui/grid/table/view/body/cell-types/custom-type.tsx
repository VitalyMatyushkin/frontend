/**
 * Created by Anatoly on 26.07.2016.
 */


import * as React from 'react';

export interface CustomTypeProps {
    cell:       any
    dataItem:	any
}

export class CustomType extends React.Component<CustomTypeProps, {}>{
	render() {
		const parseFunction = this.props.cell.typeOptions.parseFunction,
			result = parseFunction ? parseFunction(this.props.dataItem) : null;
		return (
			<div className="eDataList_listItemCell">
				{result}
			</div>
		);
	}
}