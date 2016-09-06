/**
 * Created by wert on 06.09.16.
 */

const Immutable = require('immutable');

/** Load in binding data for all dates which have events */
function loadMonthDistinctEventDatesToBinding(monthDate, activeSchoolId, eventsBinding){
	const 	monthStartDate	= new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
			monthEndDate	= new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

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
}

module.exports.setNextMonth = setNextMonth;
module.exports.setPrevMonth = setPrevMonth;
module.exports.setSelectedDate = setSelectedDate;
module.exports.setCurrentMonth = loadMonthDistinctEventDatesToBinding;