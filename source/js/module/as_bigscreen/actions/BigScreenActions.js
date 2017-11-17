const	Immutable	= require('immutable'),
		Promise		= require('bluebird');

/* HELPERS */

/**
 * Return random event id from array events
 */
function getRandomEventId(eventsArray) {
	if (eventsArray.length !== 0) {
		const maxRand = eventsArray.length;

		let rand = Math.random() * (maxRand - 1);
		rand = Math.round(rand);

		const randomEventsId = eventsArray[rand].id;

		return randomEventsId;
	}
};

function getLastFiveFinishedEvents(activeSchoolId) {
	const dayStart = new Date();
	const filter = {
		limit: 5,
		order: "startTime DESC",
		where: {
			clubId: { $exists: false },
			status: {
				$in: ['FINISHED']
			},
			startTime: {
				$lte:	dayStart
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
			clubId: { $exists: false },
			startTime: {
				$gte:	dayStart
			},
			status: {
				$in: ['ACCEPTED', 'FINISHED']
			}
		}
	};

	return window.Server.publicSchoolEvents.get( {schoolId: activeSchoolId}, { filter: filter});
};

/**
 * Get school data by domain
 * Split domain name by dots, then first chunk of full domain name splitter by underscore to chop ‘bs’ prefix.
 * Second part used for locating school by domain name
 */
function getSchoolData() {
	const domain = document.location.hostname,
		domainNameArray = domain.split('.'),
		domainName = domainNameArray[0].split('_'),
		filter ={
			where: {
				domain : domainName[1]
			}
		};

	return window.Server.publicSchools.get({ filter: filter });
};

/**
 * Get ten upcoming events for footer
 *
 */
function getFooterEvents(activeSchoolId) {
	const dayStart = new Date(); // current day

	return window.Server.publicSchoolEvents.get(
		{schoolId:	activeSchoolId},
		{
			filter: {
				limit: 10,
				where: {
					clubId: { $exists: false },
					startTime: {
						$gte: dayStart
					},
					status: {
						$in: ['ACCEPTED', 'FINISHED']
					}
				}
			}
		}
	);
};

function getEvent(activeSchoolId, eventId){
	return window.Server.publicSchoolEvent.get({
		schoolId:	activeSchoolId,
		eventId:	eventId
	});
};

function getEventPhotos(activeSchoolId, eventId){
	return window.Server.publicSchoolEventPhotos.get({
		schoolId:	activeSchoolId,
		eventId:	eventId
	});
};

function getSchoolPhotos(activeSchoolId, albumId){
	return window.Server.publicSchoolAlbumPhotos.get({
		schoolId:	activeSchoolId,
		albumId:	albumId
	});
};

function getSchoolPublicData(activeSchoolId){
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
			clubId: { $exists: false },
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
	const eventsArray = binding.toJS('lastFiveEvents.events'),
		highlightEventId = getRandomEventId(eventsArray);

	let albumId;

	if (typeof highlightEventId !== 'undefined') {
		return getEvent(activeSchoolId, highlightEventId)
				.then(event => {
					binding.set('highlightEvent.event', Immutable.fromJS(event));
					return getEventPhotos(activeSchoolId, highlightEventId);
				})
				.then(photos => {
					if (photos.length !== 0){
						binding.atomically()
							.set('highlightEvent.photos', Immutable.fromJS(photos))
							.set('highlightEvent.isSync', true)
							.commit();
					} else {
						getSchoolPublicData(activeSchoolId).then(school => {
							albumId = school.defaultAlbumId;
							getSchoolPhotos(activeSchoolId, albumId).then(photos => {
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
		}
};

function setFooterEvents(activeSchoolId, binding){
	binding.set('footerEvents.isSync', false);

	return getFooterEvents(activeSchoolId).then(eventsData => {
		binding.atomically()
			.set('footerEvents.events',				Immutable.fromJS(eventsData))
			.set('footerEvents.currentEventIndex',	Immutable.fromJS(0))
			.set('footerEvents.isSync',				true)
			.commit();
	});
};

/**
 * Call only if exist array of photos
 */
function getRandomPhotoIndex(photos) {
	const maxRand = photos.length;

	if (maxRand <= 0) {
		throw new RangeError('Array photos empty');
	}
	let rand = Math.random() * (maxRand - 1);
	rand = Math.round(rand);

	return rand;
};

function setNextSevenDaysEvents(activeSchoolId, eventsBinding) {
	eventsBinding.set('nextSevenDaysEvents.isSync', false);

	return getNextSevenDaysEvents(activeSchoolId).then(eventsData => {
		eventsBinding.set('nextSevenDaysEvents.events',	Immutable.fromJS(eventsData));
		eventsBinding.set('nextSevenDaysEvents.isSync',	 true);
	});
};

function setLastFiveFinishedEvents(activeSchoolId, eventsBinding) {
	eventsBinding.set('lastFiveEvents.isSync', false);

	return getLastFiveFinishedEvents(activeSchoolId).then(eventsData => {
		eventsBinding.set('lastFiveEvents.events', Immutable.fromJS(eventsData));
		setHighlightEvent(activeSchoolId,eventsBinding);
		const eventsId = eventsData.map(event => event.id);

		return Promise.all(eventsId.map(eventId => {
			return getEventPhotos(activeSchoolId, eventId).then(photos => {
				if (photos.length !== 0) {
					eventsBinding.set('lastFiveEvents.photos', Immutable.fromJS(photos));
					return true;
				} else {
					return getSchoolPublicData(activeSchoolId).then(school => {
						return getSchoolPhotos(activeSchoolId, school.defaultAlbumId);
					}).then(photos => {
						if (photos.length !== 0) {
							eventsBinding.set('lastFiveEvents.photos', Immutable.fromJS(photos));
						}
						return true;
					});
				}
			});
		})).then( () => {
			eventsBinding.set('lastFiveEvents.eventsId', Immutable.fromJS(eventsId));
			eventsBinding.set('lastFiveEvents.isSync', true);
		});
	});
};

function setClosestFiveEvents(activeSchoolId, eventsBinding) {
	eventsBinding.set('closestFiveEvents.isSync', false);

	return getClosestFiveEvents(activeSchoolId).then(eventsData => {
		eventsBinding.set('closestFiveEvents.events',	Immutable.fromJS(eventsData));
		eventsBinding.set('closestFiveEvents.isSync',	true);
	});
};

/**
 * Get school id and set it to binding, then call next functions
 *
 */
function setSchoolId(binding) {
	return getSchoolData().then(school => {
		const schoolId = school[0].id;

		binding.set('domainSchoolId', Immutable.fromJS(schoolId));
		setLastFiveFinishedEvents(schoolId, binding);
		setClosestFiveEvents(schoolId, binding);
		setFooterEvents(schoolId, binding);
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
			clubId: { $exists: false },
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

module.exports.setFooterEvents					= setFooterEvents;
module.exports.setHighlightEvent				= setHighlightEvent;
module.exports.getRandomPhotoIndex				= getRandomPhotoIndex;
module.exports.setSchoolId						= setSchoolId;