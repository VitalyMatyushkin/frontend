import * as React from 'react';

import {ConfirmPopup} from "module/ui/confirm_popup";
import {CheckboxList} from "module/ui/checkbox_list/checkbox_list";
import {Item} from "module/ui/checkbox_list/models/item";

import 'styles/ui/b_cancel_event_manual_notification.scss';

export interface ClubChildrenEditNotificationListPopupProps {
	listItems: Item[]
	handleClickItemCheckbox: (id: string) => void
	handleClickSubmitButton: () => void
	handleClickCancelButton: () => void
}

export class ClubChildrenEditNotificationListPopup extends React.Component<ClubChildrenEditNotificationListPopupProps, {}> {
	render() {
		return (
			<ConfirmPopup
				okButtonText={'Send booking forms'}
				handleClickOkButton={this.props.handleClickSubmitButton}
				handleClickCancelButton={this.props.handleClickCancelButton}
				customStyle={'mSmallWidth'}
			>
				<div className='bCancelEventManualNotification'>
					<CheckboxList
						title={'Students list'}
						items={this.props.listItems}
						handleClickItemCheckbox={this.props.handleClickItemCheckbox}
					/>
				</div>
			</ConfirmPopup>
		);
	}
}