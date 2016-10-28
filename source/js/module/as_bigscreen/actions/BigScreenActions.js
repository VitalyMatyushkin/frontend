const Immutable = require('immutable');

const highlightEventIds = [
	"57c4cc56b734c2d80fda9c20"
];

/** Load in binding data for all dates which have events */
function setHighlightEvent(activeSchoolId, binding){
	binding.set('highlightEvent.isSync', false);

	return window.Server.publicSchoolEvent.get({
			schoolId:	activeSchoolId,
			eventId:	highlightEventIds[0]
	}).then( event => {
		binding.set('highlightEvent.event', Immutable.fromJS(event));

		return window.Server.publicSchoolEventPhotos.get({
			schoolId:	activeSchoolId,
			eventId:	highlightEventIds[0]
		});
	}).then( photos => {
		binding.atomically()
			.set('highlightEvent.photos', Immutable.fromJS(photos))
			.set('highlightEvent.isSync', true)
			.commit();
	});
}

module.exports.setHighlightEvent = setHighlightEvent;