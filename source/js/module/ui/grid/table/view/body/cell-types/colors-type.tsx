/**
 * Created by Anatoly on 21.07.2016.
 */

import * as React from 'react';

export interface ColorTypeProps {
    cell: any
    dataItem: any
}

export class ColorsType extends React.Component<ColorTypeProps, {}> {
	render() {
		const 	value = this.props.cell.getValue(this.props.dataItem),
				result = value ? value.map((useColor,clrKey) => {
                    return <div key={clrKey} className="eDataList_listItemColor" style={{background: useColor}}/>;
                }) : null;
		return (
			<div className="eDataList_listItemCell">
				{result}
			</div>
		);
	}
}
