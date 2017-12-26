import * as React from 'react';
import {CancelEventManualNotificationUser} from "module/as_manager/pages/event/view/event_header/cancel_event_manual_notification/cancel_event_manual_notification_user";

const Style = require('styles/ui/b_cancel_event_manual_notification.scss');

export interface CancelEventManualNotificationUserListProps {
	users: any[]
	handleClickUserActivityCheckbox: (userId: string, permissionId: string) => any
}

export class CancelEventManualNotificationUserList extends React.Component<
	CancelEventManualNotificationUserListProps, {}> {

	render() {
		return (
			<div className='eCancelEventManualNotification_userList'>
				{
					this.props.users.map(user => {
						return (
							<CancelEventManualNotificationUser
								user = {user}
								handleClickUserActivityCheckbox = {
									() => this.props.handleClickUserActivityCheckbox(user.userId, user.permissionId)}
							/>
						);
					})
				}
			</div>
		);
	}
}