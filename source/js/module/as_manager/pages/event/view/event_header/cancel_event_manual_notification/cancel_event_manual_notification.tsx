import * as React from 'react';
import {CancelEventManualNotificationHeader} from "./cancel_event_manual_notification_header";
import {CancelEventManualNotificationUserList} from "./cancel_event_manual_notification_user_list";
import {UserData} from './user_data';

import 'styles/ui/b_cancel_event_manual_notification.scss';

export interface CancelEventManualNotificationProps {
	users: UserData[]
	handleClickUserActivityCheckbox: (userId: string, permissionId: string) => void
}

export class CancelEventManualNotification extends React.Component<CancelEventManualNotificationProps, {}> {
	render() {
		return (
			<div className = 'bCancelEventManualNotification'>
				<CancelEventManualNotificationHeader/>
				<CancelEventManualNotificationUserList
					users = {this.props.users}
					handleClickUserActivityCheckbox = {(userId, permissionId) => this.props.handleClickUserActivityCheckbox(userId, permissionId)}
				/>
			</div>
		);
	}
}