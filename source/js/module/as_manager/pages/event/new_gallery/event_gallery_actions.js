/**
 * Created by wert on 16.10.16.
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
	}).then(() => binding.set('isUploading', false));
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
	).then(() => this.getDefaultBinding().set('isUploading', false));
}

module.exports.addPhotoToEvent = addPhotoToEvent;
module.exports.deletePhotoFromEvent = deletePhotoFromEvent;