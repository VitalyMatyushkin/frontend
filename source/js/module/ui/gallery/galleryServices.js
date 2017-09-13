/**
 * Created by Anatoly on 09.02.2016.
 */

'use strict';
const   Immutable		= require('immutable');

/**
 * General methods for the gallery.
 *
 * @param galleryBinding {object} - Morearty default binding
 * @param galleryServiceList {object} =
 * {
 *     albums:{Service},
 *     album:{Service},
 *     photos:{Service},
 *     photo:{Service}
 * }
 * @param params {object} =
 * {
 *     schoolId:{id},
 *     eventId:{id},
 *     newsId:{id},
 *     ......
 *     albumId:{id}
 * }
 */
const galleryServices = function(galleryBinding, galleryServiceList, params){
    const self = this;
    self.binding = galleryBinding;
    self._serviceList = galleryServiceList;
    self._params = params;

    self.albums = {
        get:function(){
            return self._serviceList.albums.get(self._params);
        },
        post:function(newAlbum){
            return self._serviceList.albums.post(self._params, newAlbum);
        }
    };
    self.album = {
        get:function(albumId){
            const params = self._getParamsWithAlbumId(albumId);

            return self._serviceList.album.get(params);
        },
        put:function(albumId, model){
            const params = self._getParamsWithAlbumId(albumId);

            return self._serviceList.album.put(params, model);
        },
        delete:function(albumId){
            const params = self._getParamsWithAlbumId(albumId);

            return self._serviceList.album.delete(params);
        }
    };
    self.photos = {
        get: function (albumId, filter) {
            const params = self._getParamsWithAlbumId(albumId);

            return self._serviceList.photos.get(params, filter);
        },
        post: function (albumId, newPhoto) {
            const params = self._getParamsWithAlbumId(albumId);

            return self._serviceList.photos.post(params, newPhoto);
        },
        /** Will upload given File and finally return promise which nobody cares */
        upload: function(file, isUploadingBinding){
            const   binding     = self.binding.sub('album'),
                    albumId     = binding.get('id'),
                    imgService  = window.Server.images;

            function startUploading(){
                isUploadingBinding.set(true);
            }
            function stopUploading(){
                isUploadingBinding.set(false);
            }

            startUploading();
            return imgService.upload(file)
                .then(self.photos._add.bind(this))
                .then(res => {
					stopUploading();
                    binding.sub('photos').update(photos => photos.unshift(Immutable.fromJS(res)));
                    if(!binding.get('coverUrl'))
                        return self.photo.pin(albumId, res.picUrl);
                })
                .catch(stopUploading);
        },
        /** will create new API Photo item and return promise of AJAX request
         * @private */
        _add:function(imgUrl) {
            const   ownerId     = self.binding.get('album.ownerId'),
                    albumId     = self.binding.get('album.id'),
                    model       = {
                    name:           "",
                    description:    "",
                    authorId:       ownerId,
                    picUrl:         imgUrl
                };
            return self.photos.post(albumId, model);
        }
    };
    self.photo = {
        "get":function(albumId, photoId){
            const params = self._getParamsWithAlbumId(albumId);
            params.photoId = photoId;

            return self._serviceList.photo.get(params);
        },
        put:function(albumId, photoId, model){
			const params = self._getParamsWithAlbumId(albumId);
            params.photoId = photoId;

            return self._serviceList.photo.put(params, model);
        },
        delete:function(albumId, photoId){
			const params = self._getParamsWithAlbumId(albumId);
            params.photoId = photoId;

            return self._serviceList.photo.delete(params);
        },
        pin:function(albumId, coverUrl){
            return self.album.put(albumId, {coverUrl:coverUrl});
        }
    };

	self._getParamsWithAlbumId = function(albumId){
		const params = Object.assign({}, self._params);
		if(albumId)
			params.albumId = albumId;

		return params;
	};
};

module.exports = galleryServices;