/**
 * Created by Anatoly on 07.10.2016.
 */

const	React			= require('react'),
		Morearty		= require('morearty'),

		{MonthCalendar}	= require('../../../../../ui/calendar/month_calendar'),
		CalendarActions	= require('./calendar-actions');

/** Show calendar section: month calendar and events for selected date */
const Calendar = React.createClass({
	mixins:[Morearty.Mixin],
	propType: {
		schoolIdList: React.PropTypes.array.isRequired
	},
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

		/** Loading initial data for this month */
		CalendarActions.setCurrentMonth(new Date(), this.props.schoolIdList, this.getDefaultBinding());
	},
	render: function(){
		const	binding			= this.getDefaultBinding(),
				todayDate		= binding.get('todayDate'),
				monthDate		= binding.get('monthDate'),
				selectedDate	= binding.get('selectedDate'),
				eventsData		= binding.get('eventsData');

		return (
			<MonthCalendar
				monthDate={monthDate}
				todayDate={todayDate}
				selectedDate={selectedDate}
				onMonthClick={ (date) => CalendarActions.setCurrentMonth(date, this.props.schoolIdList, binding) }
				onDateClick={ date => CalendarActions.setSelectedDate(date, this.props.schoolIdList, binding) }
				eventsData={eventsData}
			/>
		);
	}
});

module.exports = Calendar;