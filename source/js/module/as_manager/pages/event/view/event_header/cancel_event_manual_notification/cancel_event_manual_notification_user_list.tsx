import * as React from 'react';
import {CancelEventManualNotificationUser} from "./cancel_event_manual_notification_user";
import {UserData} from "./user_data";

import 'styles/ui/b_cancel_event_manual_notification.scss';

export interface CancelEventManualNotificationUserListProps {
	users: UserData[]
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