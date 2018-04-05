/**
 * Created by Anatoly on 20.07.2016.
 */

import {CellTypeList} from './cell-types/cell-type-list';
import * as React from 'react';

export interface CellProps {
    column: 	{
        cell:   {
            type: string,
            [key: string]: any
        },
        width: any
    }
    dataItem:		{
        id:     any
        name:   any
    }
	region?: string
}

export function Cell(props: CellProps){
    const 	cell		= props.column.cell,
            width		= props.column.width,
            CellType	= CellTypeList[cell.type];



    return <CellType cell={cell} dataItem={props.dataItem}  width={width} region={props.region}/>;
}
