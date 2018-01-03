import * as React from 'react';
import * as Checkbox from 'module/ui/checkbox/checkbox';
import * as propz from 'propz';
import {UserData} from "./user_data";

import 'styles/ui/b_cancel_event_manual_notification.scss';

export interface CancelEventManualNotificationUserProps {
	user: UserData
	handleClickUserActivityCheckbox: (userId: string, permissionId: string) => void
}

const USER_ROLE_SERVER_TO_CLIENT = {
	'PLAYER': 'player',
	'PARENT': 'parent',
	'STAFF': 'staff'
};


export class CancelEventManualNotificationUser extends React.Component<CancelEventManualNotificationUserProps, {}> {

	getUserAscription(): string {
	    const type = propz.get(this.props.user, ['extra', 'type'], undefined) as string|undefined;
        let result  = propz.get(USER_ROLE_SERVER_TO_CLIENT, [type], '') as string;

	    if(type === 'PARENT') {
	        const   studentFirstName    = propz.get(this.props.user, ['extra', 'parentOf', 'firstName'], undefined),
                    studentLastName     = propz.get(this.props.user, ['extra', 'parentOf', 'lastName'], undefined);

	        if(studentFirstName && studentLastName) {
	            result = `parent of ${studentFirstName} ${studentLastName}`;
            }
        }

	    return result;
	}

	render() {
		return (
			<div className='eCancelEventManualNotification_user'>
				<div className='eCancelEventManualNotification_userName'>
					{`${this.props.user.firstName} ${this.props.user.lastName}`}<br/>
					<span className='eCancelEventManualNotification_userRole'>
						{ this.getUserAscription() }
					</span>
				</div>
				<div className='eCancelEventManualNotification_checkBoxWrapper'>
					<Checkbox
						isChecked = {this.props.user.checked}
						onChange = {() => this.props.handleClickUserActivityCheckbox(this.props.user.userId, this.props.user.permissionId) }
					/>
				</div>
			</div>
		);
	}
}