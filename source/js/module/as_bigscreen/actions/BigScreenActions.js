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

/* HELPERS */
function setHighlightEvents(activeSchoolId, binding) {
	const events = binding.toJS('lastFiveEvents.events');

	binding.set('highlightEvents', Immutable.fromJS({isSync: false}));
	return Promise.all(
		events.map(event => getHighlightEvent(activeSchoolId, event.id))
	).then(dataArray => {
		binding.set('highlightEvents', Immutable.fromJS({
			isSync:			true,
			events:			dataArray,
			currentIndex:	0
		}));

		return true;
	});
}

function getHighlightEvent(activeSchoolId, eventId) {
	const data = {
		isSync: false
	};
	
	let albumId;

	let result = getEvent(activeSchoolId, eventId)
		.then(event => {
			data.event = event;

			return getEventPhotos(activeSchoolId, eventId);
		})
		.then(photos => {
			let result;

			if (photos.length !== 0) {
				data.photos = photos;
				data.isSync = true;

				result = true;
			} else {
				result = getSchoolPublicData(activeSchoolId).then(school => {
					albumId = school.defaultAlbumId;

					return getSchoolPhotos(activeSchoolId, albumId);
				}).then(photos => {
					if (photos.length !== 0) {
						data.photos = photos;
						data.isSync = true;
					}

					return true;
				});
			};

			return Promise.resolve(result);
		});

	return Promise.resolve(result).then(() => data);
};

function setFooterEvents(activeSchoolId, binding){
	binding.set('footerEvents.isSync', false);

	return getFooterEvents(activeSchoolId).then(eventsData => {
		binding.atomically()
			.set('footerEvents.events',				Immutable.fromJS(eventsData))
			.set('footerEvents.currentEventIndex',	Immutable.fromJS(0))
			.set('footerEvents.isSync',				true)
			.commit();

		return true;
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

function setLastFiveFinishedEvents(activeSchoolId, eventsBinding) {
	eventsBinding.set('lastFiveEvents.isSync', false);

	return getLastFiveFinishedEvents(activeSchoolId).then(eventsData => {
		eventsBinding.set('lastFiveEvents.events', Immutable.fromJS(eventsData));
		eventsBinding.set('lastFiveEvents.isSync', true);

		return true;
	});
};

function setClosestFiveEvents(activeSchoolId, eventsBinding) {
	eventsBinding.set('closestFiveEvents.isSync', false);

	return getClosestFiveEvents(activeSchoolId).then(eventsData => {
		eventsBinding.set('closestFiveEvents.events',	Immutable.fromJS(eventsData));
		eventsBinding.set('closestFiveEvents.isSync',	true);

		return true;
	});
};

/**
 * Get school id and set it to binding, then call next functions
 *
 */
function initialize(binding) {
	let schoolId;

	return getSchoolData().then(schools => {
		schoolId = schools[0].id;
		binding.set('domainSchoolId', Immutable.fromJS(schoolId));

		return setLastFiveFinishedEvents(schoolId, binding)
	}).then(() => {
		return setHighlightEvents(schoolId, binding)
	}).then(() => {
		return setClosestFiveEvents(schoolId, binding);
	}).then(() => {
		return setFooterEvents(schoolId, binding);
	});
};

module.exports.setFooterEvents		= setFooterEvents;
module.exports.getHighlightEvent	= getHighlightEvent;
module.exports.setHighlightEvents	= setHighlightEvents;
module.exports.getRandomPhotoIndex	= getRandomPhotoIndex;
module.exports.initialize			= initialize;