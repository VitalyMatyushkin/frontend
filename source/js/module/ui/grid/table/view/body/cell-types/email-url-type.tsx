/**
 * Created by Anatoly on 09.09.2016.
 */

import * as React from 'react';

export interface EmailUrlTypeProps {
    cell: any
    dataItem: any
    width: any
}

export function EmailUrlType(props: EmailUrlTypeProps){
	const 	value       = props.cell.getValue(props.dataItem),
			cellStyle 	= props.width ? {maxWidth: props.width} : null,
			result      = value ? value : null;

	return (
		<div className="eDataList_listItemCell mBreakWord" style={cellStyle}>
			{result}
		</div>
	);
}
