/**
 * Created by Anatoly on 07.10.2016.
 */

const Immutable = require('immutable');

const EVENT_STATUS_ARRAY = [
	'INVITES_SENT',
	'COLLECTING_INVITE_RESPONSE',
	'ACCEPTED',
	'FINISHED'
];

/** Load in binding data for all dates which have events */
function loadMonthDistinctEventDatesToBinding(monthDate, schoolIdList, eventsBinding){
	const 	monthStartDate	= new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
			monthEndDate	= new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);

	eventsBinding.set('distinctEventDatesData.isSync', false);
	let filter;

	if (schoolIdList === '' || typeof schoolIdList === 'undefined') {
		filter = {
			limit: 1000,
			where: {
				startTime: {
					$gte: 	monthStartDate,
					$lt: 	monthEndDate
				},
				status: {
					$in: EVENT_STATUS_ARRAY
				}
			}
		};
	} else {
		filter = {
			limit: 1000,
			where: {
				startTime: {
					$gte: 	monthStartDate,
					$lt: 	monthEndDate
				},
				status: {
					$in: EVENT_STATUS_ARRAY
				},
				schoolId: {
					$in: schoolIdList
				}
			}
		};
	}


	return window.Server.studentSchoolEventsDates.get({ filter: filter }).then( data => {

	/**
	 * Fake data
	 */
	//const data = {"dates":["2017-01-22T19:00:00.000Z","2017-01-25T04:00:00.000Z","2017-01-26T08:00:00.000Z","2017-01-26T16:00:00.000Z"]};
	const dates = data.dates.map( dateStr => new Date(dateStr));

	/** Converting array of dates to proper calendar format */

	let eventsData = {};
	dates.forEach( date => {
		eventsData[`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`] = true;
	});

	eventsBinding.atomically()
		.set('eventsData', Immutable.fromJS(eventsData))
		.set('monthDate', monthDate)
		.commit();

	});

}

function loadDailyEvents(date, schoolIdList, eventsBinding) {
	const 	dayStart	= new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
			dayEnd		= new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);

	eventsBinding.set('selectedDateEventsData.isSync', false);
	let filter;
	if (schoolIdList === '' || typeof schoolIdList === 'undefined') {
		filter = {
			limit: 100,
			where: {
				startTime: {
					$gte: dayStart,
					$lt: dayEnd
				},
				status: {
					$in: EVENT_STATUS_ARRAY
				}
			}
		};
	} else {
		filter = {
			limit: 100,
			where: {
				startTime: {
					$gte: dayStart,
					$lt: dayEnd
				},
				status: {
					$in: EVENT_STATUS_ARRAY
				},
				schoolId: {
					$in: schoolIdList
				}
			}
		};
	}


	return window.Server.studentSchoolEvents.get({ filter: filter}).then( eventsData => {
		eventsBinding.atomically()
			.set('selectedDateEventsData.events', Immutable.fromJS(eventsData))
			.set('selectedDateEventsData.isSync', true)
			.commit();
	});
}

function setNextMonth(schoolIdList, eventsBinding) {
	const 	currentMonthDate 	= eventsBinding.get('monthDate'),
			nextMonthDate		= new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1);

	eventsBinding.set('monthDate', nextMonthDate);

	loadMonthDistinctEventDatesToBinding(nextMonthDate, schoolIdList, eventsBinding);
}

function setPrevMonth(schoolIdList, eventsBinding) {
	const 	currentMonthDate 	= eventsBinding.get('monthDate'),
			prevMonthDate		= new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1);

	eventsBinding.set('monthDate', prevMonthDate);

	loadMonthDistinctEventDatesToBinding(prevMonthDate, schoolIdList, eventsBinding);
}

function setSelectedDate(date, schoolIdList, eventsBinding) {
	eventsBinding.set('selectedDate', date);

	loadDailyEvents(date, schoolIdList, eventsBinding);
}

module.exports.setNextMonth						= setNextMonth;
module.exports.setPrevMonth						= setPrevMonth;
module.exports.setSelectedDate					= setSelectedDate;
module.exports.setCurrentMonth					= loadMonthDistinctEventDatesToBinding;
