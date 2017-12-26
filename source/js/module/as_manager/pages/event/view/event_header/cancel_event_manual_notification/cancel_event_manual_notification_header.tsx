import * as React from 'react';

const Style = require('styles/ui/b_cancel_event_manual_notification.scss');

export class CancelEventManualNotificationHeader extends React.Component<{}, {}> {
	render() {
		return (
			<h1 className='eCancelEventManualNotification_header'>
				Notification list
			</h1>
		);
	}
}