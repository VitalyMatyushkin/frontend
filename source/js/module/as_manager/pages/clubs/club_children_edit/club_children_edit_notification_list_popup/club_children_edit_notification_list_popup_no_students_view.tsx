import * as React from 'react';

import 'styles/ui/b_cancel_event_manual_notification.scss';

export class ClubChildrenEditNotificationListPopupNoStudentsView extends React.Component<{}, {}> {
	render() {
		return (
			<div className='eCancelEventManualNotification_noStudentsView'>
				<h1 className='eCancelEventManualNotification_noStudentsViewHeader'>
					Students list
				</h1>
				<p className='eCancelEventManualNotification_noStudentsViewBody'>
					There are no parental accounts linked to the team members.
				</p>
			</div>
		);
	}
}