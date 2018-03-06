/**
 * Created by wert on 16.10.16.
 */

const	Immutable	= require('immutable'),
		RoleHelper	= require('./../../../../helpers/role_helper');

/* Set of actions school staff can perform on gallery:
*/
function addPhotoToEvent(role, binding, schoolId, eventId, file) {
	binding.atomically()
		.set('isSync',		false)
		.set('isUploading',	true)
		.commit();

	let service;

	switch (role) {
		case RoleHelper.USER_ROLES.PARENT:
			service = window.Server.childEventPhotos;
			break;
		default:
			service = window.Server.schoolEventPhotos;
			break;
	}

	return window.Server.images.upload(file).then(picUrl => {
		return service.post(
			{
				schoolId:	schoolId,
				eventId:	eventId
			},
			{
				picUrl: picUrl
			}
		)
	}).then(() => {
		binding.set('isUploading', false);
		return getPhotosForEvent(role, binding, schoolId, eventId);	// and reloading all photos
	});
}

function deletePhotoFromEvent(role, binding, schoolId, eventId, photoId) {
	binding.atomically()
		.set('isSync',		false)
		.set('isDeleting',	true)
		.commit();

	let service;

	switch (role) {
		case RoleHelper.USER_ROLES.PARENT:
			service = window.Server.childEventPhoto;
			break;
		default:
			service = window.Server.schoolEventPhoto;
			break;
	}

	return service.delete(
		{
			schoolId:	schoolId,
			eventId:	eventId,
			photoId:	photoId
		}
	).then(() => {
		binding.set('isDeleting', false);
		return getPhotosForEvent(role, binding, schoolId, eventId);	// and reloading all photos
	});
}

function getPhotosForEvent(role, binding, schoolId, eventId) {
	binding.set('isSync', false);

	let service;

	switch (role) {
		case RoleHelper.USER_ROLES.PARENT:
			service = window.Server.childEventPhotos;
			break;
		default:
			service = window.Server.schoolEventPhotos;
			break;
	}

	return service.get({
			schoolId:	schoolId,
			eventId:	eventId
		},
		{
			filter:
				{
					limit: 100
				}
	}).then( photos => {
		binding.atomically()
			.set('photos',		Immutable.fromJS(photos))
			.set('isSync',		true)
			.commit();
	});
}

function changePhotoPreset(role, binding, schoolId, eventId, photoId, preset) {
	let service;

	switch (role) {
		case RoleHelper.USER_ROLES.PARENT:
			service = window.Server.childEventPhoto;
			break;
		default:
			service = window.Server.schoolEventPhoto;
			break;
	}

	return service.put(
			{
				schoolId:	schoolId,
				eventId:	eventId,
				photoId:	photoId
			},
			{
				accessPreset: preset
			}
		).then(() => {
			binding.set('isUploading', false);
			return getPhotosForEvent(role, binding, schoolId, eventId);
		});
}

function changePicData(role, binding, schoolId, eventId, photoId, picData) {
	let service;

	switch (role) {
		case RoleHelper.USER_ROLES.PARENT:
			service = window.Server.childEventPhoto;
			break;
		default:
			service = window.Server.schoolEventPhoto;
			break;
	}

	return service.put(
			{
				schoolId:	schoolId,
				eventId:	eventId,
				photoId:	photoId
			},
			picData
		).then(() => {
			binding.set('isUploading', false);
			return getPhotosForEvent(role, binding, schoolId, eventId);
		});
}

module.exports.addPhotoToEvent		= addPhotoToEvent;
module.exports.deletePhotoFromEvent	= deletePhotoFromEvent;
module.exports.changePhotoPreset	= changePhotoPreset;
module.exports.changePicData	    = changePicData;