import * as React from 'react';

import {SplitButton} from "module/ui/split_button/split_button";

const Style = require('styles/ui/b_split_button.scss');

interface SplitButtonWrapperProps {
	isDisableButton: boolean
	handleClickSaveButton: () => void
	handleClickSaveAndEditNotificationList: () => void
}

export enum Actions {
	SaveAndEditNotificationList = 'SAVE_AND_EDIT_NOTIFICATION_LIST'
}

const actionItemList = [
		{
			id: Actions.SaveAndEditNotificationList,
			text:'Save and edit notification list'
		}
	];

export class SplitButtonWrapper extends React.Component<SplitButtonWrapperProps, {}> {

	handleClickListItem(itemId: string) {
		switch (itemId) {
			case Actions.SaveAndEditNotificationList: {
				this.props.handleClickSaveAndEditNotificationList();
				break;
			}
		}
	}

	render() {
		return (
			<div className='bSplitButtonWrapper'>
				<SplitButton
					text = { 'Save' }
					handleClickMainButton = { this.props.handleClickSaveButton }
					handleClickListItem = { itemId => this.handleClickListItem(itemId) }
					actionItemList = { actionItemList }
					isDisable = { this.props.isDisableButton }
				/>
			</div>
		);
	}
}