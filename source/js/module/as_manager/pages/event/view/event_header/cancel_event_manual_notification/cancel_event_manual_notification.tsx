import * as React from 'react';
import {CancelEventManualNotificationHeader} from "module/as_manager/pages/event/view/event_header/cancel_event_manual_notification/cancel_event_manual_notification_header";
import {CancelEventManualNotificationUserList} from "module/as_manager/pages/event/view/event_header/cancel_event_manual_notification/cancel_event_manual_notification_user_list";

const Style = require('styles/ui/b_cancel_event_manual_notification.scss');

export interface CancelEventManualNotificationProps {
	users: any[]
	handleClickUserActivityCheckbox: (userId: string, permissionId: string) => any
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