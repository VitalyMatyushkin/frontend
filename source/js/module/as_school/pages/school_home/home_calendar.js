/* @flow */
const 	React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		Challenges		= require('module/ui/challenges/challenges'),
		MonthCalendar	= require('module/ui/calendar/month_calendar'),
		CalendarActions	= require('./CalendarActions');

const 	CalendarStyle	= require('./../../../../../styles/ui/b_home_calender.scss');

/** Show calendar section: month calendar and events for selected date */
const HomeCalender = React.createClass({
	mixins:[Morearty.Mixin ],

	componentWillMount: function () {
		const	binding			= this.getDefaultBinding().sub('events'),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId');

		/** Loading initial data for this month */
		CalendarActions.setCurrentMonth(new Date(), activeSchoolId, binding);
		CalendarActions.setSelectedDate(new Date(), activeSchoolId, binding);
		CalendarActions.setNextDaysEvents(activeSchoolId, binding, 365);
		CalendarActions.setPrevDaysFinishedEvents(activeSchoolId, binding, 365);
	},

	getMonthDate: function() {
		const binding = this.getDefaultBinding().sub('events');

		return typeof binding.get('monthDate') !== 'undefined' ? binding.get('monthDate') : new Date();
	},

	handleClickEvent: function(eventId: string) {
		document.location.hash = 'event/' + eventId + '?tab=gallery';
	},

	render: function(){
		const	binding 					= this.getDefaultBinding().sub('events');

		const	activeSchoolId				= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				todayDate					= binding.get('todayDate'),
				selectedDate				= binding.get('selectedDate'),
				isDistinctDatesInSync		= binding.get('distinctEventDatesData.isSync'),
				monthDate					= this.getMonthDate(),
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
			<div className="bHomeCalender" id="eSchoolCalendar">
				<h1 className="eHomeCalender_title"> Calendar </h1>

				<div className="eEvents_container">
					<div className="eEvents_row">
						<div className="eEvents_leftSideContainer">
							<div className="bCalendar mTransparent">
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
								events			= {isSelectedDateEventsInSync ? selectedDateEvents.toJS() : {}}
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