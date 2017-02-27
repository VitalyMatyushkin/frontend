/* @flow */
const 	React			= require('react'),
		Immutable		= require('immutable'),
		Challenges		= require('module/ui/challenges/challenges'),
		MonthCalendar	= require('module/ui/calendar/month_calendar'),
		CalendarActions	= require('./CalendarActions'),
		Morearty		= require('morearty');

/** Show calendar section: month calendar and events for selected date */
const HomeCalender = React.createClass({
	mixins:[Morearty.Mixin ],

	componentWillMount: function () {
		const	binding			= this.getDefaultBinding().sub('events'),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId');

		/** Loading initial data for this month */
		CalendarActions.setCurrentMonth(new Date(), activeSchoolId, binding);
		CalendarActions.setSelectedDate(new Date(), activeSchoolId, binding);
		CalendarActions.setNextDaysEvents(activeSchoolId, binding);
		CalendarActions.setPrevDaysFinishedEvents(activeSchoolId, binding, 365);
	},

	handleClickEvent: function(eventId) {
		document.location.hash = 'event/' + eventId + '?tab=gallery';
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
					<h1>Calendar</h1>
					<hr/>
				</div>
				<div className="eEvents_container">
					<div className="eEvents_row">
						<div className="eEvents_leftSideContainer">
							<div className="bCalendar">
								<MonthCalendar
									monthDate		= {monthDate}
									todayDate		= {todayDate}
									selectedDate	= {selectedDate}
									onMonthClick	= { (data) => CalendarActions.setCurrentMonth(data, activeSchoolId, binding) }
									onDateClick		= { (date) => CalendarActions.setSelectedDate(date, activeSchoolId, binding) }
									eventsData		= {Immutable.fromJS(eventsData)}
								/>
							</div>
						</div>
						<div className="eEvents_rightSideContainer">
							<Challenges
								activeSchoolId	= {activeSchoolId}
								isSync			= {isSelectedDateEventsInSync}
								isDaySelected	= {true}
								events			= {selectedDateEvents.toJS()}
								onClick			= {this.handleClickEvent}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = HomeCalender;