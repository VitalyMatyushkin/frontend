const	Immutable	= require('immutable'),
		Promise		= require('bluebird');

const highlightEventIds = {
		"57b6c9a6dd69264b6c5ba82d": [
			"57c4cc56b734c2d80fda9c20"
		],
		"58138b405f33e0b72d709e3b": [	// for prod demo
			"5819f64e8d118cab2214d449"
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
		],
		"58138b405f33e0b72d709e3b": [	// for prod demo
			"581a18367fa3913f0959e381",
			"581a187f6680025f093a65ec"
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

function getRandomEventId(activeSchoolId, eventsBinding) {
	if (typeof eventsBinding.toJS('closestFiveEvents.events') !== 'undefined') {
		const closestFiveEvents = eventsBinding.toJS('closestFiveEvents.events'),
			maxRand = closestFiveEvents.length;

		let rand = Math.random() * (maxRand - 1);
		rand = Math.round(rand);

		const randomEventsId = closestFiveEvents[rand].id;
		return randomEventsId;
	} else {
		return undefined;
	}
};

function getLastFiveEvents(activeSchoolId) {
	const filter = {
		limit: 5,
		order: "startTime DESC",
		where: {
			status: {
				$in: ['FINISHED']
			}
		}
	};

	return window.Server.publicSchoolEvents.get( {schoolId: activeSchoolId}, { filter: filter});
};

function getClosestFiveEvents(activeSchoolId) {
	const dayStart = new Date(); // current day

	const filter = {
		limit: 5,
		order: "startTime ASC",
		where: {
			startTime: {
				$gte:	dayStart
			},
			status: {
				$in: ['ACCEPTED']
			}
		}
	};

	return window.Server.publicSchoolEvents.get( {schoolId: activeSchoolId}, { filter: filter});
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

function getSchoolPhoto(activeSchoolId, albumId){
	return window.Server.publicSchoolAlbumPhotos.get({
		schoolId:	activeSchoolId,
		albumId:	albumId
	});
};

function getSchoolAlbumId(activeSchoolId){
	return window.Server.publicSchool.get({
		schoolId:	activeSchoolId
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

	const highlightEventId = getRandomEventId(activeSchoolId, binding);
	let albumId;

	return getEvent(activeSchoolId, highlightEventId)
		.then(event => {
			binding.set('highlightEvent.event', Immutable.fromJS(event));

			return getEventPhoto(activeSchoolId, highlightEventId);
		})
		.then(photos => {
			if (photos.length !== 0){
			binding.atomically()
				.set('highlightEvent.photos', Immutable.fromJS(photos))
				.set('highlightEvent.isSync', true)
				.commit();
			} else {
				getSchoolAlbumId(activeSchoolId).then(school => {
						albumId = school.defaultAlbumId;
						getSchoolPhoto(activeSchoolId, albumId).then(photos => {
							if (photos.length !== 0) {
							binding.atomically()
								.set('highlightEvent.photos', Immutable.fromJS(photos))
								.set('highlightEvent.isSync', true)
								.commit();
							}
						});
					});
			};
		});
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

function setLastFiveEvents(activeSchoolId, eventsBinding) {
	eventsBinding.set('lastFiveEvents.isSync', false);

	return getLastFiveEvents(activeSchoolId).then(eventsData => {
		eventsBinding.set('lastFiveEvents.events',	Immutable.fromJS(eventsData));
		let eventsId = [];
		let albumId;

		eventsData.forEach(i => {eventsId.push(i.id)});
		eventsId.forEach(i => {
			getEventPhoto(activeSchoolId, i).then(photos => {
				if (photos.length !== 0) {
				eventsBinding.atomically()
					.set('lastFiveEvents.photos', Immutable.fromJS(photos))
					.commit();
				} else {
				getSchoolAlbumId(activeSchoolId).then(school => {
					albumId = school.defaultAlbumId;
					getSchoolPhoto(activeSchoolId, albumId).then(photos => {
						if (photos.length !== 0) {
						eventsBinding.atomically()
							.set('lastFiveEvents.photos', Immutable.fromJS(photos))
							.commit();
						}
					});
				});
				}
			});
		});
		eventsBinding.set('lastFiveEvents.eventsId',	Immutable.fromJS(eventsId));
		eventsBinding.set('lastFiveEvents.isSync',	 true);
	});
};

function setClosestFiveEvents(activeSchoolId, eventsBinding) {
	eventsBinding.set('closestFiveEvents.isSync', false);

	return getClosestFiveEvents(activeSchoolId).then(eventsData => {
		eventsBinding.set('closestFiveEvents.events',	Immutable.fromJS(eventsData));
		eventsBinding.set('closestFiveEvents.isSync',	true);
		setHighlightEvent(activeSchoolId,eventsBinding);
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

module.exports.setFooterEvents									= setFooterEvents;
module.exports.setNextSevenDaysEvents						= setNextSevenDaysEvents;
module.exports.setPrevSevenDaysFinishedEvents		= setPrevSevenDaysFinishedEvents;
module.exports.setLastFiveEvents								= setLastFiveEvents;
module.exports.setClosestFiveEvents							= setClosestFiveEvents;
module.exports.setHighlightEvent								= setHighlightEvent;

