const	CalendarView	= require('module/ui/calendar/calendar'),
		React			= require('react'),
		Immutable		= require('immutable'),
		DateTimeMixin	= require('module/mixins/datetime'),
		Sport			= require('module/ui/icons/sport_icon'),
        ChallengeModel	= require('module/ui/challenges/challenge_model'),
		Challenges		= require('module/ui/challenges/challenges'),
		EventHelper		= require('module/helpers/eventHelper'),
		MonthCalendar	= require('module/ui/calendar/month_calendar'),
		CalendarActions	= require('./CalendarActions'),
		Morearty        = require('morearty'),
		MoreartyHelper	= require('module/helpers/morearty_helper');

/** Block to show calendar block and list of events for selected day in calendar */
const HomeCalender = React.createClass({
	mixins:[Morearty.Mixin, DateTimeMixin],

	componentWillMount: function () {
		const 	binding 				= this.getDefaultBinding().sub('events'),
				activeSchoolId			= this.getMoreartyContext().getBinding().get('activeSchoolId');

		/** Loading initial data for this month */
		CalendarActions.setCurrentMonth(new Date(), activeSchoolId, binding);

		CalendarActions.setSelectedDate(new Date(), activeSchoolId, binding);
	},

	render: function(){
		const 	binding 					= this.getDefaultBinding().sub('events'),
				activeSchoolId				= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				todayDate					= binding.get('todayDate'),
				monthDate					= binding.get('monthDate'),
				selectedDate				= binding.get('selectedDate'),
				isDistinctDatesInSync		= binding.get('distinctEventDatesData.isSync'),
				distinctDates				= binding.get('distinctEventDatesData.dates'),
				isSelectedDateEventsInSync	= binding.get('selectedDateEventsData.isSync'),
				selectedDateEvents			= binding.get('selectedDateEventsData.events');

		/** Converting array of dates to proper calendar format */
		let eventsData = {};
		if(isDistinctDatesInSync === true) {
			distinctDates.forEach( date => {
				eventsData[`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`] = true;
			})
		}

		return (
			<div className="eSchoolCalenderContainer">
				<div className="eSchoolFixtureTab eCalendar_tab">
					<h1>Calendar</h1><hr/>
				</div>
				<div className="eSchoolCalendarWrapper">
					<div className="bCalendar">
						<MonthCalendar
							monthDate={monthDate}
							todayDate={todayDate}
							selectedDate={selectedDate}
							onNextMonthClick={ () => CalendarActions.setNextMonth(activeSchoolId, binding) }
							onPrevMonthClick={ () => CalendarActions.setPrevMonth(activeSchoolId, binding) }
							onDateClick={ (date) => CalendarActions.setSelectedDate(date, activeSchoolId, binding) }
							eventsData={Immutable.fromJS(eventsData)}
						/>
					</div>
					<div className="eSchoolCalenderFixtureList">
						<Challenges
							activeSchoolId={activeSchoolId}
							isSync={isSelectedDateEventsInSync}
							isDaySelected={true}
							events={selectedDateEvents.toJS()}
						/>
					</div>

				</div>
			</div>
		);
	}
});

module.exports = HomeCalender;