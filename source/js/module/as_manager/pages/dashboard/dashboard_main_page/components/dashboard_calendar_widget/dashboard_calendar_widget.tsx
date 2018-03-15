import * as React from 'react';

import {EventsCalendar} from 'module/as_manager/pages/events/calendar/events_calendar.tsx';

import 'styles/ui/dashboard/dashboard_calendar_widget/dashboard_calendar_widget.scss'

export interface DashboardCalendarWidgetProps {
	binding: any
}

export class DashboardCalendarWidget extends React.Component<DashboardCalendarWidgetProps, {}> {
	render() {
		return (
			<div className='bDashboardCalendarWidget'>
				<EventsCalendar
					extraStyleForContainer={'mNoMargin'}
					binding={this.props.binding}
				/>
			</div>
		);
	}
}