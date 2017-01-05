/**
 * Created by Anatoly on 26.09.2016.
 */

const Immutable = require('immutable');

/** Load in binding data for all dates which have events
 *  Required for building calendar highlight - it requires only dates without event content, so loaded blazing fast
 */
function loadMonthDistinctEventDatesToBinding(monthDate, activeSchoolId, eventsBinding){
	const 	monthStartDate	= new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
			monthEndDate	= new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);

	eventsBinding.set('distinctEventDatesData.isSync', false);	// TODO: is it okay?

	/* filter to load all event dates for one month */
	const filter = {
		limit: 1000,
		where: {
			startTime: {
				$gte: 	monthStartDate,
				$lt: 	monthEndDate
			}
		}
	};

	return window.Server.schoolEventDates.get({ schoolId: activeSchoolId}, { filter: filter }).then( data => {
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
			}//,
			// status: {
			// 	$nin: ['REJECTED']
			// }
		}
	};

	return window.Server.events.get( {schoolId: activeSchoolId}, { filter: filter}).then( eventsData => {
		eventsBinding.atomically()
			.set('selectedDateEventsData.events', Immutable.fromJS(eventsData))
			.set('selectedDateEventsData.isSync', true)
			.commit();
	});
}

function setNextMonth(activeSchoolId, eventsBinding) {
	const 	currentMonthDate 	= eventsBinding.get('monthDate'),
			nextMonthDate		= new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1);

	eventsBinding.set('monthDate', nextMonthDate);

	loadMonthDistinctEventDatesToBinding(nextMonthDate, activeSchoolId, eventsBinding);
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
