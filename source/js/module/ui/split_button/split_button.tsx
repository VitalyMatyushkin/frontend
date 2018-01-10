import * as React from 'react';

import {MainButton} from "module/ui/split_button/main_button";
import {SecondaryButton} from "module/ui/split_button/secondary_button";
import {ActionItemList} from "module/ui/split_button/action_item_list";

const Style = require('styles/ui/b_split_button.scss');

interface SplitButtonProps {
	text: string
	handleClickMainButton: () => void
	handleClickListItem: (itemId: string) => void
	actionItemList: any[]
	isDisable: boolean
}

export interface SplitButtonState {
	isOpenActionList: boolean
}

export class SplitButton extends React.Component<SplitButtonProps, SplitButtonState> {
	componentWillMount(){
		this.setState({isOpenActionList: false});
	}

	isEnableSecondaryButton() {
		return typeof this.props.actionItemList !== 'undefined' &&
			this.props.actionItemList.length > 0;
	}

	isOpenActionList() {
		return typeof this.props.actionItemList !== 'undefined' &&
			this.props.actionItemList.length > 0 &&
			this.state.isOpenActionList;
	}

	handleClickSecondaryButton() {
		if( this.isEnableSecondaryButton() ) {
			this.setState({ isOpenActionList: !this.state.isOpenActionList } );
		}
	}

	handleBlurSecondaryButton() {
		this.setState({ isOpenActionList: false } );
	}

	renderActionItemList() {
		let actionItemList = null;

		if( this.isOpenActionList() ) {
			actionItemList = (
				<ActionItemList
					actionItemList = { this.props.actionItemList }
					handleClickListItem = { this.props.handleClickListItem }
				/>
			);
		}

		return actionItemList;
	}

	render() {
		return (
			<div className='bSplitButton'>
				<MainButton
					handleClick = { this.props.handleClickMainButton }
					text = { this.props.text }
					isDisabled = { this.props.isDisable }
				/>
				<SecondaryButton
					handleClick = { () => this.handleClickSecondaryButton() }
					handleBlur = { () => this.handleBlurSecondaryButton() }
					isDisabled = { this.props.isDisable }
				/>
				{ this.renderActionItemList() }
			</div>
		);
	}
}