/**
 * Created by wert on 16.10.16.
 */

const Immutable = require('immutable');

/* Set of actions school staff can perform on gallery:
*/
function addPhotoToEvent(binding, schoolId, eventId, file) {
	binding.atomically()
		.set('isSync',		false)
		.set('isUploading',	true)
		.commit();

	return window.Server.images.upload(file).then(picUrl => {
		return window.Server.schoolEventPhotos.post(
			{
				schoolId:	schoolId,
				eventId:	eventId
			},
			{
				picUrl: picUrl
			}
		)
	}).then(() => {
		binding.set('isUploading', false)
		return getPhotosForEvent(binding, schoolId, eventId);	// and reloading all photos
	});
}

function deletePhotoFromEvent(binding, schoolId, eventId, photoId) {
	binding.atomically()
		.set('isSync',		false)
		.set('isUploading',	true)
		.commit();

	return window.Server.schoolEventPhoto.delete(
		{
			schoolId:	schoolId,
			eventId:	eventId,
			photoId:	photoId
		}
	).then(() => {
		binding.set('isUploading', false);
		return getPhotosForEvent(binding, schoolId, eventId);	// and reloading all photos
	});
}

function getPhotosForEvent(binding, schoolId, eventId) {
	binding.set('isSync', false);
	return window.Server.schoolEventPhotos.get({
		schoolId:	schoolId,
		eventId:	eventId
	}).then( photos => {
		binding.atomically()
			.set('photos',		Immutable.fromJS(photos))
			.set('isSync',		true)
			.commit();
	});
}

module.exports.addPhotoToEvent = addPhotoToEvent;
module.exports.deletePhotoFromEvent = deletePhotoFromEvent;