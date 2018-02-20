import * as React from 'react';

import {CancelEventManualNotificationUserList} from "module/as_manager/pages/event/view/event_header/cancel_event_manual_notification/cancel_event_manual_notification_user_list";
import {UserData} from "module/as_manager/pages/event/view/event_header/cancel_event_manual_notification/user_data";

import 'styles/ui/b_cancel_event_manual_notification.scss';
import {ConfirmPopup} from "module/ui/confirm_popup";

export interface ClubChildrenEditNotificationListPopupProps {
	users: UserData[]
	handleClickUserActivityCheckbox: (userId: string, permissionId: string) => void
	handleClickSubmitButton: () => void
	handleClickCancelButton: () => void
}

export class ClubChildrenEditNotificationListPopup extends React.Component<ClubChildrenEditNotificationListPopupProps, {}> {
	render() {
		return (
			<ConfirmPopup
				okButtonText		    = { 'Send booking forms' }
				handleClickOkButton	    = { this.props.handleClickSubmitButton }
				handleClickCancelButton	= { this.props.handleClickCancelButton }
				customStyle			    = { 'mSmallWidth' }
			>
				<div className = 'bCancelEventManualNotification'>
					<h1 className='eCancelEventManualNotification_header'>
						User list
					</h1>
					<CancelEventManualNotificationUserList
						users = {this.props.users}
						handleClickUserActivityCheckbox = { this.props.handleClickUserActivityCheckbox }
					/>
				</div>
			</ConfirmPopup>
		);
	}
}