const	Immutable	= require('immutable'),
		Promise		= require('bluebird');

const highlightEventIds = {
		"57b6c9a6dd69264b6c5ba82d": [
			"57c4cc56b734c2d80fda9c20"
		]
	},
	footerEvents = {
		"57b6c9a6dd69264b6c5ba82d": [
			"57c4cc56b734c2d80fda9c20",
			"57c6d3d88b1985a20e287ade",
			"57c6d310eed5cbbd0ef34095",
			"581875260f53e9713906c8dc",
			"58052cabb6f65e782d125aae",
			"57ff21756d491de602b413be",
			"57f667979dd7ea0009ea6752"
		]
	};

/* HELPERS */
function getHighlightEventId(activeSchoolId) {
	if(typeof highlightEventIds[activeSchoolId] !== "undefined" && highlightEventIds[activeSchoolId].length > 0) {
		return highlightEventIds[activeSchoolId][0];
	} else {
		return undefined;
	}
};

function getFooterEvents(activeSchoolId) {
	if(typeof footerEvents[activeSchoolId] !== "undefined") {
		return footerEvents[activeSchoolId];
	} else {
		return undefined;
	}
};

function getEvent(activeSchoolId, eventId){
	return window.Server.publicSchoolEvent.get({
		schoolId:	activeSchoolId,
		eventId:	eventId
	});
};

function getEventPhoto(activeSchoolId, eventId){
	return window.Server.publicSchoolEventPhotos.get({
		schoolId:	activeSchoolId,
		eventId:	eventId
	});
};

function getNextSevenDaysEvents(activeSchoolId) {
	const dayStart = new Date(); // current day

	// create end day = start day + 7 days
	const dayEnd = new Date();
	dayEnd.setDate(dayEnd.getDate() + 7)

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

	return window.Server.publicSchoolEvents.get( {schoolId: activeSchoolId}, { filter: filter});
};
/* HELPERS */

function setHighlightEvent(activeSchoolId, binding){
	binding.set('highlightEvent.isSync', false);

	const highlightEventId = getHighlightEventId();

	if(typeof highlightEventId !== 'undefined') {
		return getEvent(activeSchoolId, highlightEventId)
			.then(event => {
				binding.set('highlightEvent.event', Immutable.fromJS(event));

				return getEventPhoto(activeSchoolId, highlightEventId);
			})
			.then(photos => {
				binding.atomically()
					.set('highlightEvent.photos', Immutable.fromJS(photos))
					.set('highlightEvent.isSync', true)
					.commit();
			});
	} else {
		return getNextSevenDaysEvents(activeSchoolId)
			.then(events => {
				binding.set('highlightEvent.event', Immutable.fromJS(events[0]));

				return getEventPhoto(activeSchoolId, events[0].id);
			})
			.then(photos => {
				binding.atomically()
					.set('highlightEvent.photos', Immutable.fromJS(photos))
					.set('highlightEvent.isSync', true)
					.commit();
			});
	}
};

function setFooterEvents(activeSchoolId, binding){
	binding.set('footerEvents.isSync', false);

	const eventIds = getFooterEvents(activeSchoolId);

	if(typeof eventIds !== 'undefined') {
		return Promise.all(eventIds.map(eventId => {
			return window.Server.publicSchoolEvent.get({
				schoolId:	activeSchoolId,
				eventId:	eventId
			});
		})).then(events => {
			const currentEventIndex = events.length !== 0 ? 0 : undefined;

			binding.atomically()
				.set('footerEvents.events',				Immutable.fromJS(events))
				.set('footerEvents.currentEventIndex',	Immutable.fromJS(currentEventIndex))
				.set('footerEvents.isSync',				true)
				.commit();
		});
	} else {
		return getNextSevenDaysEvents(activeSchoolId)
			.then(events => {
				return Promise.all(events.map(e => {
					return window.Server.publicSchoolEvent.get({
						schoolId:	activeSchoolId,
						eventId:	e.id
					});
				}));
			})
			.then(events => {
				const currentEventIndex = events.length !== 0 ? 0 : undefined;

				binding.atomically()
					.set('footerEvents.events',				Immutable.fromJS(events))
					.set('footerEvents.currentEventIndex',	Immutable.fromJS(currentEventIndex))
					.set('footerEvents.isSync',				true)
					.commit();
			});
	}
};

function setNextSevenDaysEvents(activeSchoolId, eventsBinding) {
	eventsBinding.set('nextSevenDaysEvents.isSync', false);

	return getNextSevenDaysEvents(activeSchoolId).then(eventsData => {
		eventsBinding.set('nextSevenDaysEvents.events',	Immutable.fromJS(eventsData));
		eventsBinding.set('nextSevenDaysEvents.isSync',	 true);
	});
};

function setPrevSevenDaysFinishedEvents(activeSchoolId, eventsBinding) {
	const	dayStart	= new Date(),
		dayEnd		= new Date();

	dayStart.setDate(dayStart.getDate() - 7);

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
};

module.exports.setHighlightEvent				= setHighlightEvent;
module.exports.setFooterEvents					= setFooterEvents;
module.exports.setNextSevenDaysEvents			= setNextSevenDaysEvents;
module.exports.setPrevSevenDaysFinishedEvents	= setPrevSevenDaysFinishedEvents;