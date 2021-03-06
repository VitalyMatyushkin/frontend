/**
 * Created by wert on 06.09.16.
 */

const Immutable = require('immutable');

/** Load in binding data for all dates which have events */
function loadMonthDistinctEventDatesToBinding(monthDate, activeSchoolId, eventsBinding) {
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
			$or: [
				{	// internal events are always shown no matter what
					eventType: { $in: ['INTERNAL_HOUSES', 'INTERNAL_TEAMS']}
				},
				{	// external events created by me always visible with any status
					eventType: { $in: ['EXTERNAL_SCHOOLS'] },
					inviterSchoolId: activeSchoolId
				},
				{	// external events where I'm invited shown only in some special statuses
					eventType: { $in: ['EXTERNAL_SCHOOLS'] },
					inviterSchoolId: { $ne: activeSchoolId },
					invitedSchoolIds: activeSchoolId,
					status: { $in: [
						'ACCEPTED',
						'REJECTED',
						'FINISHED',
						'CANCELED'
					]}
				}
			]
		}
	};

	return window.Server.publicSchoolEventDates.get({ schoolId: activeSchoolId}, { filter: filter }).then( eventsData => {
		const events = eventsData.dates.map( dateStr => new Date(dateStr));

		eventsBinding
			.atomically()
			.set('distinctEventDatesData.dates',	Immutable.fromJS(events))
			.set('monthDate',						monthDate)
			.set('distinctEventDatesData.isSync',	true)
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
			},
			$or: [
				{	// internal events are always shown no matter what
					eventType: { $in: ['INTERNAL_HOUSES', 'INTERNAL_TEAMS']}
				},
				{	// external events created by me always visible with any status
					eventType: { $in: ['EXTERNAL_SCHOOLS'] },
					inviterSchoolId: activeSchoolId
				},
				{	// external events where I'm invited shown only in some special statuses
					eventType: { $in: ['EXTERNAL_SCHOOLS'] },
					inviterSchoolId: { $ne: activeSchoolId },
					invitedSchoolIds: activeSchoolId,
					status: { $in: [
						'ACCEPTED',
						'REJECTED',
						'FINISHED',
						'CANCELED'
					]}
				}
			]
		}
	};

	return window.Server.publicSchoolEvents.get( {schoolId: activeSchoolId}, { filter: filter })
		.then( eventsData => {
			eventsBinding
				.atomically()
				.set('selectedDateEventsData.events', Immutable.fromJS(eventsData))
				.set('selectedDateEventsData.isSync', true)
				.commit();

			return true;
	});
}

function setNextMonth(activeSchoolId, eventsBinding) {
	const 	currentMonthDate 	= eventsBinding.get('monthDate'),
			nextMonthDate		= new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1);

	eventsBinding.set('monthDate', nextMonthDate);

	loadMonthDistinctEventDatesToBinding(nextMonthDate, activeSchoolId, eventsBinding);
}

function setNextDaysEvents(activeSchoolId, eventsBinding, optDates = 7) {
	const dayStart = new Date(); // current day
	
	// create end day = start day + option days
	const dayEnd = new Date();
	dayEnd.setDate(dayEnd.getDate() + optDates);

	eventsBinding.set('nextSevenDaysEvents.isSync', false);

	const filter = {
		limit: 10,
		where: {
			startTime: {
				$gte:	dayStart,
				$lt:	dayEnd
			},
			status: {
				$in: ['ACCEPTED', 'FINISHED', 'INVITES_SENT']
			}
		}
	};

	return window.Server.publicSchoolEvents.get( {schoolId: activeSchoolId}, { filter: filter}).then( eventsData => {
		eventsBinding
			.atomically()
			.set('nextSevenDaysEvents.events',	Immutable.fromJS(eventsData))
			.set('nextSevenDaysEvents.isSync',	true)
			.commit();
	});
}

function setPrevDaysFinishedEvents(activeSchoolId, eventsBinding, optDates = 7) {
	const	dayStart	= new Date(),
			dayEnd		= new Date();

	dayStart.setDate(dayStart.getDate() - optDates);

	eventsBinding.set('prevSevenDaysFinishedEvents.isSync', false);

	const filter = {
		limit: 10,
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
		eventsBinding
			.atomically()
			.set('prevSevenDaysFinishedEvents.events',	Immutable.fromJS(eventsData))
			.set('prevSevenDaysFinishedEvents.isSync',	true)
			.commit();
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

	return loadDailyEvents(date, activeSchoolId, eventsBinding);
}

module.exports.setNextMonth						= setNextMonth;
module.exports.setPrevMonth						= setPrevMonth;
module.exports.setSelectedDate					= setSelectedDate;
module.exports.setCurrentMonth					= loadMonthDistinctEventDatesToBinding;
module.exports.setNextDaysEvents				= setNextDaysEvents;
module.exports.setPrevDaysFinishedEvents		= setPrevDaysFinishedEvents;