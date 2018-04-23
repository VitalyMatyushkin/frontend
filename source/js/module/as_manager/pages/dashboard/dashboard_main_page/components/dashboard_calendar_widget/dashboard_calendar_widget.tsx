import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import {EventsCalendar} from 'module/as_manager/pages/events/calendar/events_calendar.tsx';

import 'styles/ui/dashboard/dashboard_calendar_widget/dashboard_calendar_widget.scss'

export interface DashboardCalendarWidgetProps {
	binding: any
}

export interface DashboardCalendarWidgetState {
	isSync: boolean
	width: number
}

export enum CalendarSize {
	Medium = 'MEDIUM',
	Small = 'SMALL',
	ExtraSmall = 'EXTRA_SMALL'
}

// It's good size for cute widget fit
const UP_CONSTRAINT_OF_MEDIUM_SIZE = 890;
const UP_CONSTRAINT_OF_SMALL_SIZE = 720;
const UP_CONSTRAINT_OF_EXTRA_SMALL_SIZE = 570;

export class DashboardCalendarWidget extends React.Component<DashboardCalendarWidgetProps, DashboardCalendarWidgetState> {
	widget = undefined;
	componentWillMount() {
		this.setState({isSync: false});
	}
	componentDidMount() {
		this.setState({
			isSync: true,
			width: this.widget.clientWidth
		});
	}
	handleResize(width) {
		this.setState({width});
	}
	getSize() {
		if(this.state.width <= UP_CONSTRAINT_OF_EXTRA_SMALL_SIZE) {
			return CalendarSize.ExtraSmall;
		} else if(this.state.width <= UP_CONSTRAINT_OF_SMALL_SIZE) {
			return CalendarSize.Small;
		} else if(this.state.width <= UP_CONSTRAINT_OF_MEDIUM_SIZE) {
			return CalendarSize.Medium;
		} else {
			return '';
		}
	}
	render() {
		return (
			<div
				className='bDashboardCalendarWidget'
				ref={(widget) => { this.widget = widget; }}
			>
				{
					this.state.isSync ?
						<EventsCalendar
							size={this.getSize()}
							extraStyleForContainer={'mNoMargin'}
							binding={this.props.binding}
						/> :
						null
				}
				<ReactResizeDetector handleWidth onResize={(width) => this.handleResize(width)} />
			</div>
		);
	}
}