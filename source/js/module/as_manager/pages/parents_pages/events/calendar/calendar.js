/**
 * Created by Anatoly on 07.10.2016.
 */

const	React			= require('react'),
		Morearty		= require('morearty'),

		MonthCalendar	= require('../../../../../ui/calendar/month_calendar'),
		CalendarActions	= require('./calendar-actions');

/** Show calendar section: month calendar and events for selected date */
const Calendar = React.createClass({
	mixins:[Morearty.Mixin],
	propType: {
		childIdList: React.PropTypes.array.isRequired
	},
	componentWillMount: function () {
		/** Loading initial data for this month */
		CalendarActions.setCurrentMonth(new Date(), this.props.childIdList, this.getDefaultBinding());
	},
	componentWillUnmount: function () {
		this.getDefaultBinding().clear();
	},
	render: function(){
		const	binding			= this.getDefaultBinding(),
				todayDate		= binding.get('todayDate'),
				monthDate		= binding.get('monthDate'),
				selectedDate	= binding.get('selectedDate'),
				eventsData		= binding.get('eventsData');

		return (
			<MonthCalendar
				isSync			= { binding.toJS('isEventsDataSync') }
				monthDate		= { monthDate }
				todayDate		= { todayDate }
				selectedDate	= { selectedDate }
				onMonthClick	= { date => CalendarActions.setCurrentMonth(date, this.props.childIdList, binding) }
				onDateClick		= { date => CalendarActions.setSelectedDate(date, this.props.childIdList, binding) }
				eventsData		= { eventsData }
			/>
		);
	}
});



module.exports = Calendar;