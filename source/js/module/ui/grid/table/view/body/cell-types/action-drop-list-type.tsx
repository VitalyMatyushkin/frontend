/**
 * Created by Anatoly on 09.09.2016.
 */

import * as	React from 'react';
import * as	DropList from 'module/ui/action-drop-list';

export interface ActionDropListTypeProps {
    cell: any
    dataItem: any
}


export function ActionDropListType(props: ActionDropListTypeProps) {
	const 	item 			= props.dataItem,
			options 		= props.cell.typeOptions,
			getActionList 	= options.getActionList,
			actionHandler 	= options.actionHandler,
			actionList 		= getActionList ? getActionList(item): null;

	return (
		<div className="eDataList_listItemCell mActions">
			<DropList 	key 				= { 'actions-' + item.id }
						itemId 				= { item.id }
						listItems 			= { actionList }
						listItemFunction 	= { actionHandler} />
		</div>
	);

}
