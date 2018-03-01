import * as Immutable from 'immutable';
import * as	BPromise from 'bluebird';

export class ActionsGallery {
	static deletePhotoFromEvent(service, binding, albumId: string, photoId: string) {
		binding.atomically()
			.set('isSync', false)
			.set('isDeleting', true)
			.commit();

		return service.photo.delete(albumId, photoId)
			.then(() => {
				binding.set('isDeleting', false);
				return this.getPhotosForAlbum(service, binding, albumId);	// and reloading all photos
			});
	}

	static getPhotosForAlbum(service, binding, albumId: string) {
		binding.set('isSync', false);

		return service.photos.get(albumId, {filter: {limit: 100}}).then(photos => {
			binding.atomically()
				.set('photos', Immutable.fromJS(photos))
				.set('isSync', true)
				.commit();
			return BPromise.resolve(photos);
		});
	}

	static changePicData(service, binding, albumId: string, photoId: string, model) {
		return service.photo.put(albumId, photoId, model)
		.then(() => {
			binding.set('isUploading', false);
			return this.getPhotosForAlbum(service, binding, albumId);	// and reloading all photos
		});
	}
}