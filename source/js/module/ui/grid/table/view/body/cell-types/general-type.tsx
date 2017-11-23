/**
 * Created by Anatoly on 21.07.2016.
 */

import * as React from 'react';

export interface GeneralTypeProps {
    cell: 		any
    dataItem:	any,
    width:      any
}

export function GeneralType(props: GeneralTypeProps){
	const 	value 		= props.cell.getValue(props.dataItem),
			cellStyle 	= props.width ? {maxWidth: props.width} : null,
			result 		= value ? value : null;

	return (
		<div className="eDataList_listItemCell" style={cellStyle}>
			{result}
		</div>
	);
}