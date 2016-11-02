const	Immutable	= require('immutable'),
		Promise		= require('bluebird');

const highlightEventIds = {
		"57b6c9a6dd69264b6c5ba82d": ["57c4cc56b734c2d80fda9c20"]
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

/** Load in binding data for all dates which have events */
function setHighlightEvent(activeSchoolId, binding){
	binding.set('highlightEvent.isSync', false);

	return window.Server.publicSchoolEvent.get({
			schoolId:	activeSchoolId,
			eventId:	highlightEventIds[activeSchoolId][0]
	}).then( event => {
		binding.set('highlightEvent.event', Immutable.fromJS(event));

		return window.Server.publicSchoolEventPhotos.get({
			schoolId:	activeSchoolId,
			eventId:	highlightEventIds[activeSchoolId][0]
		});
	}).then( photos => {
		binding.atomically()
			.set('highlightEvent.photos', Immutable.fromJS(photos))
			.set('highlightEvent.isSync', true)
			.commit();
	});
}

function setFooterEvents(activeSchoolId, binding){
	binding.set('footerEvents.isSync', false);

	return Promise.all(footerEvents[activeSchoolId].map(eventId => {
		return window.Server.publicSchoolEvent.get({
			schoolId:	activeSchoolId,
			eventId:	eventId
		});
	})).then(events => {
		binding.atomically()
			.set('footerEvents.events', Immutable.fromJS(events))
			.set('footerEvents.isSync', true)
			.commit();
	});
}

module.exports.setHighlightEvent	= setHighlightEvent;
module.exports.setFooterEvents		= setFooterEvents;