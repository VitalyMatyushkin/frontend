/**
 * Created by Anatoly on 26.07.2016.
 */

import * as React 	from 'react';
import {SVG} 		from 'module/ui/svg';

export interface _DataItem {
    id: any
    [key: string]: any
}

export interface ActionButtonsTypeProps {
    cell: 		{
        typeOptions: {
            onItemEdit?: (_DataItem) => any
            onItemView?: (_DataItem) => any
            onItemSelect?: (_DataItem) => any
            onItemRemove?: (_DataItem) => any
        }
    },
    dataItem: _DataItem
}

export class ActionButtonsType extends React.Component<ActionButtonsTypeProps, {}> {

	getButtons(){
		const	itemButtons = [],
				item		= this.props.dataItem,
				options		= this.props.cell.typeOptions;

		options.onItemEdit && itemButtons.push(
			<span key={item.id+'edit'} id="edit_row" onClick={options.onItemEdit.bind(null, item)} className="bLinkLike bTooltip"
				  data-description="Edit">
				<SVG icon="icon_edit"/>
			</span>
		);
		options.onItemView && itemButtons.push(
			<span key={item.id+'view'} id="view_row" onClick={options.onItemView.bind(null, item)}
				  className="bLinkLike bViewBtn bTooltip" data-description="View">
				<SVG icon="icon_eye"/>
			</span>
		);
		options.onItemSelect && itemButtons.push(
			<span key={item.id+'view'} id="view_select_row" onClick={options.onItemSelect.bind(null, item)}
				  className="bLinkLike bViewBtn bTooltip" data-description="View">
				<SVG icon="icon_eye"/>
			</span>
		);
		options.onItemRemove && itemButtons.push(
			<span key={item.id+'remove'} id="remove_row" onClick={options.onItemRemove.bind(null, item)}
				  className="bLinkLike delete_btn bTooltip" data-description="Delete">
				<SVG icon="icon_delete"/>
			</span>
		);

		return itemButtons;
	}

	render() {
		return (
			<div className="eDataList_listItemCell mActions">
				{this.getButtons()}
			</div>
		);
	}
}
