import * as React from 'react';

import {ConfirmPopup} from "module/ui/confirm_popup";
import {CheckboxList} from "module/ui/checkbox_list/checkbox_list";
import {Item} from "module/ui/checkbox_list/models/item";

import 'styles/ui/b_cancel_event_manual_notification.scss';
import {ClubChildrenEditNotificationListPopupNoStudentsView} from "module/as_manager/pages/clubs/club_children_edit/club_children_edit_notification_list_popup/club_children_edit_notification_list_popup_no_students_view";

export interface ClubChildrenEditNotificationListPopupProps {
	listItems: Item[]
	handleClickItemCheckbox: (id: string) => void
	handleClickSubmitButton: () => void
	handleClickCancelButton: () => void
}

export class ClubChildrenEditNotificationListPopup extends React.Component<ClubChildrenEditNotificationListPopupProps, {}> {
	isOkButtonDisabled() {
		return this.props.listItems.length === 0 ||
			this.props.listItems.filter(item => item.checked).length === 0;
	}
	renderPopupBody() {
		if(this.props.listItems.length === 0) {
			return <ClubChildrenEditNotificationListPopupNoStudentsView/>
		} else {
			return (
				<CheckboxList
					title={'Students list'}
					items={this.props.listItems}
					handleClickItemCheckbox={this.props.handleClickItemCheckbox}
				/>
			);
		}
	}
	render() {
		return (
			<ConfirmPopup
				okButtonText={'Send booking forms'}
				handleClickOkButton={this.props.handleClickSubmitButton}
				handleClickCancelButton={this.props.handleClickCancelButton}
				isOkButtonDisabled={this.isOkButtonDisabled()}
				customStyle={'mSmallWidth'}
			>
				<div className='bCancelEventManualNotification'>
					{this.renderPopupBody()}
				</div>
			</ConfirmPopup>
		);
	}
}