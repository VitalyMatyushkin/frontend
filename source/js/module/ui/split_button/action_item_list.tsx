import * as React from 'react';

import {ActionItem} from "module/ui/split_button/action_item";

const Style = require('styles/ui/b_split_button.scss');

interface ActionItemListProps {
	actionItemList: any[]
	handleClickListItem: (itemId: string) => void
}

export class ActionItemList extends React.Component<ActionItemListProps, {}> {
	renderList() {
		return this.props.actionItemList.map(actionItem =>
			<ActionItem
				key = { actionItem.id }
				actionItemModel = { actionItem }
				handleClick = { (itemId) => this.props.handleClickListItem(itemId) }
			/>
		)
	}

	render() {
		return (
			<div className='eSplitButton_actionList'>
				{ this.renderList() }
			</div>
		);
	}
}