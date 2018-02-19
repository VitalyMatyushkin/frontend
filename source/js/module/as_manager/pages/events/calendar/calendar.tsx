/**
 * Created by Anatoly on 07.10.2016.
 */

import * as React from 'react';
import {MonthCalendar} from '../../../../ui/calendar/month_calendar';
import {CalendarActions} from './calendar-actions';
import * as Morearty from 'morearty';

interface CalendarProps {
	onSelect: (date: string) => void
}

/** Show calendar section: month calendar and events for selected date */
export const Calendar = (React as any).createClass({
	mixins:[Morearty.Mixin ],

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

		return (
			<MonthCalendar	monthDate		= {monthDate}
			                  todayDate		= {todayDate}
			                  selectedDate	= {selectedDate}
			                  onMonthClick	= {(data) => CalendarActions.setCurrentMonth(data, activeSchoolId, binding)}
			                  onDateClick		= {this.onSelect }
			                  eventsData		= {eventsData}
			/>
		);
	}
});