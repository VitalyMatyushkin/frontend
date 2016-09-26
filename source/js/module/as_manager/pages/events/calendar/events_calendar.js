/**
 * Created by Anatoly on 26.09.2016.
 */

const 	React			= require('react'),
		Challenges		= require('module/ui/challenges/challenges'),
		MonthCalendar	= require('module/ui/calendar/month_calendar'),
		CalendarActions	= require('./CalendarActions'),
		Morearty        = require('morearty');

/** Show calendar section: month calendar and events for selected date */
const EventsCalendar = React.createClass({
	mixins:[Morearty.Mixin ],

	componentWillMount: function () {
		const	binding					= this.getDefaultBinding().sub('calendar'),
				activeSchoolId			= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		/** Loading initial data for this month */
		CalendarActions.setCurrentMonth(new Date(), activeSchoolId, binding);
		CalendarActions.setSelectedDate(new Date(), activeSchoolId, binding);
	},

	render: function(){
		const 	binding 					= this.getDefaultBinding().sub('calendar'),
				activeSchoolId				= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				todayDate					= binding.get('todayDate'),
				monthDate					= binding.get('monthDate'),
				selectedDate				= binding.get('selectedDate'),
				eventsData					= binding.get('eventsData'),
				isSelectedDateEventsInSync	= binding.get('selectedDateEventsData.isSync'),
				selectedDateEvents			= binding.toJS('selectedDateEventsData.events');

		return (
			<div className="eEvents_calendar">
				<MonthCalendar
					monthDate={monthDate}
					todayDate={todayDate}
					selectedDate={selectedDate}
					onNextMonthClick={ () => CalendarActions.setNextMonth(activeSchoolId, binding) }
					onPrevMonthClick={ () => CalendarActions.setPrevMonth(activeSchoolId, binding) }
					onDateClick={ (date) => CalendarActions.setSelectedDate(date, activeSchoolId, binding) }
					eventsData={eventsData}
				/>
				<Challenges
					activeSchoolId={activeSchoolId}
					isSync={isSelectedDateEventsInSync}
					isDaySelected={true}
					events={selectedDateEvents}
				/>
			</div>
		);
	}
});

module.exports = EventsCalendar;