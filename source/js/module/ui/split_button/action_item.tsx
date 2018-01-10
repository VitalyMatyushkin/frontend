import * as React from 'react';

const Style = require('styles/ui/b_split_button.scss');

interface ActionItemProps {
	actionItemModel: any
	handleClick: (itemId: string) => void
}

export class ActionItem extends React.Component<ActionItemProps, {}> {
	render() {
		return (
			<div
				className = 'eSplitButton_actionItem'
				onMouseDown = { () => this.props.handleClick(this.props.actionItemModel.id) }
			>
				{ this.props.actionItemModel.text }
			</div>
		);
	}
}