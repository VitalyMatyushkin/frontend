import * as React from 'react';
import * as Checkbox from 'module/ui/checkbox/checkbox';

const Style = require('styles/ui/b_cancel_event_manual_notification.scss');

export interface CancelEventManualNotificationUserProps {
	user: any
	handleClickUserActivityCheckbox: (userId: string, permissionId: string) => any
}

const USER_ROLE_SERVER_TO_CLIENT = {
	'PLAYER': 'player',
	'PARENT': 'parent',
	'STAFF': 'staff'
};

export class CancelEventManualNotificationUser extends React.Component<
	CancelEventManualNotificationUserProps, {}> {

	getUserRole() {
		return typeof USER_ROLE_SERVER_TO_CLIENT[this.props.user.extra.type] !== 'undefined' ?
			USER_ROLE_SERVER_TO_CLIENT[this.props.user.extra.type] :
			'';
	}

	render() {
		return (
			<div className='eCancelEventManualNotification_user'>
				<div className='eCancelEventManualNotification_userName'>
					{`${this.props.user.firstName} ${this.props.user.lastName}`}<br/>
					<span className='eCancelEventManualNotification_userRole'>
						{ this.getUserRole() }
					</span>
				</div>
				<div className='eCancelEventManualNotification_checkBoxWrapper'>
					<Checkbox
						isChecked = {this.props.user.checked}
						onChange = {() => this.props.handleClickUserActivityCheckbox(this.props.user.userId, this.props.user.permissionId)}
					/>
				</div>
			</div>
		);
	}
}