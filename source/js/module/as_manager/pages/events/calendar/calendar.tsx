/**
 * Created by Anatoly on 07.10.2016.
 */

import * as React from 'react';
import * as Morearty from 'morearty';
import {MonthCalendar} from '../../../../ui/calendar/month_calendar';
import {CalendarActions} from './calendar-actions';
import {CalendarSize} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard_calendar_widget/dashboard_calendar_widget";

/** Show calendar section: month calendar and events for selected date */
export const Calendar = (React as any).createClass({
	mixins:[Morearty.Mixin],
	propTypes: {
		onSelect: (React as any).PropTypes.func,
		size: (React as any).PropTypes.string
	},
	componentWillMount: function () {
		const	binding			= this.getDefaultBinding(),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		/** Loading initial data for this month */
		CalendarActions.setCurrentMonth(new Date(), activeSchoolId, binding);
	},

	onSelect:function(date: string): void {
		const 	binding 		= this.getDefaultBinding(),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		CalendarActions.setSelectedDate(date, activeSchoolId, binding);

		if(typeof this.props.onSelect === 'function') {
			this.props.onSelect(date);
		}
	},
	render: function(){
		const 	binding 		= this.getDefaultBinding(),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				todayDate		= binding.get('todayDate'),
				monthDate		= binding.get('monthDate'),
				selectedDate	= binding.get('selectedDate'),
				eventsData		= binding.get('eventsData');

		if(typeof monthDate !== 'undefined') {
			return (
				<MonthCalendar
					size			= {this.props.size}
					monthDate		= {monthDate}
					todayDate		= {todayDate}
					selectedDate	= {selectedDate}
					onMonthClick	= {(data) => CalendarActions.setCurrentMonth(data, activeSchoolId, binding)}
					onDateClick		= {this.onSelect}
					eventsData		= {eventsData}
				/>
			);
		} else {
			return null;
		}
	}
});