/**
 * Created by wert on 06.09.16.
 */

const Immutable = require('immutable');

/** Load in binding data for all dates which have events */
function loadMonthDistinctEventDatesToBinding(monthDate, activeSchoolId, eventsBinding){
	const 	monthStartDate	= new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
			monthEndDate	= new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);

	eventsBinding.set('distinctEventDatesData.isSync', false);

	const filter = {
		limit: 1000,
		where: {
			startTime: {
				$gte: 	monthStartDate,
				$lt: 	monthEndDate
			},
			status: {
				$in: ['ACCEPTED', 'FINISHED']
			}
		}
	};

	return window.Server.publicSchoolEventDates.get({ schoolId: activeSchoolId}, { filter: filter }).then( eventsData => {
		const events = eventsData.dates.map( dateStr => new Date(dateStr));
		eventsBinding.set('distinctEventDatesData.dates', Immutable.fromJS(events));
		eventsBinding.set('monthDate', monthDate);
		eventsBinding.set('distinctEventDatesData.isSync', true);
	});

}

function loadDailyEvents(date, activeSchoolId, eventsBinding) {
	const 	dayStart	= new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
			dayEnd		= new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);

	eventsBinding.set('selectedDateEventsData.isSync', false);

	const filter = {
		limit: 100,
		where: {
			startTime: {
				$gte: dayStart,
				$lt: dayEnd
			},
			status: {
				$in: ['ACCEPTED', 'FINISHED']
			}
		}
	};

	return window.Server.publicSchoolEvents.get( {schoolId: activeSchoolId}, { filter: filter}).then( eventsData => {
		eventsBinding.set('selectedDateEventsData.events', Immutable.fromJS(eventsData));
		eventsBinding.set('selectedDateEventsData.isSync', true);
	});
}

function setNextMonth(activeSchoolId, eventsBinding) {
	const 	currentMonthDate 	= eventsBinding.get('monthDate'),
			nextMonthDate		= new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1);

	eventsBinding.set('monthDate', nextMonthDate);

	loadMonthDistinctEventDatesToBinding(nextMonthDate, activeSchoolId, eventsBinding);
}

function setNextSevenDaysEvents(activeSchoolId, eventsBinding) {
	const dayStart = new Date(); // current day

	// create end day = start day + 7 days
	const dayEnd = new Date();
	dayEnd.setDate(dayEnd.getDate() + 7)

	eventsBinding.set('nextSevenDaysEvents.isSync', false);

	const filter = {
		limit: 100,
		where: {
			startTime: {
				$gte:	dayStart,
				$lt:	dayEnd
			},
			status: {
				$in: ['ACCEPTED', 'FINISHED']
			}
		}
	};

	return window.Server.publicSchoolEvents.get( {schoolId: activeSchoolId}, { filter: filter}).then( eventsData => {
		eventsBinding.set('nextSevenDaysEvents.events', Immutable.fromJS(eventsData));
		eventsBinding.set('nextSevenDaysEvents.isSync', true);
	});
}

function setPrevSevenDaysFinishedEvents(activeSchoolId, eventsBinding) {
	const	dayStart	= new Date(),
			dayEnd		= new Date();

	dayStart.setDate(dayStart.getDate() - 7)

	eventsBinding.set('prevSevenDaysFinishedEvents.isSync', false);

	const filter = {
		limit: 100,
		order: "startTime DESC",
		where: {
			startTime: {
				$gte:	dayStart,
				$lt:	dayEnd
			},
			status: {
				$in: ['FINISHED']
			}
		}
	};

	return window.Server.publicSchoolEvents.get( {schoolId: activeSchoolId}, { filter: filter}).then( eventsData => {
		eventsBinding.set('prevSevenDaysFinishedEvents.events', Immutable.fromJS(eventsData));
		eventsBinding.set('prevSevenDaysFinishedEvents.isSync', true);
	});
}

function setPrevMonth(activeSchoolId, eventsBinding) {
	const 	currentMonthDate 	= eventsBinding.get('monthDate'),
			prevMonthDate		= new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1);

	eventsBinding.set('monthDate', prevMonthDate);

	loadMonthDistinctEventDatesToBinding(prevMonthDate, activeSchoolId, eventsBinding);
}

function setSelectedDate(date, activeSchoolId, eventsBinding) {
	eventsBinding.set('selectedDate', date);

	loadDailyEvents(date, activeSchoolId, eventsBinding);
}

module.exports.setNextMonth						= setNextMonth;
module.exports.setPrevMonth						= setPrevMonth;
module.exports.setSelectedDate					= setSelectedDate;
module.exports.setCurrentMonth					= loadMonthDistinctEventDatesToBinding;
module.exports.setNextSevenDaysEvents			= setNextSevenDaysEvents;
module.exports.setPrevSevenDaysFinishedEvents	= setPrevSevenDaysFinishedEvents;