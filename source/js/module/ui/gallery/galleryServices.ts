/**
 * Created by Anatoly on 09.02.2016.
 */

'use strict';
import * as Immutable from 'immutable';

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
export function galleryServices(galleryBinding, galleryServiceList, params) {
    this.binding = galleryBinding;
    this._serviceList = galleryServiceList;
    this._params = params;

    this.albums = {
        get:function(){
            return this._serviceList.albums.get(this._params);
        },
        post:function(newAlbum){
            return this._serviceList.albums.post(this._params, newAlbum);
        }
    };
    this.album = {
        get:function(albumId){
            const params = this._getParamsWithAlbumId(albumId);

            return this._serviceList.album.get(params);
        },
        put:function(albumId, model){
            const params = this._getParamsWithAlbumId(albumId);

            return this._serviceList.album.put(params, model);
        },
        delete:function(albumId){
            const params = this._getParamsWithAlbumId(albumId);

            return this._serviceList.album.delete(params);
        }
    };
    this.photos = {
        get: function (albumId, filter) {
            const params = this._getParamsWithAlbumId(albumId);

            return this._serviceList.photos.get(params, filter);
        },
        post: function (albumId, newPhoto) {
            const params = this._getParamsWithAlbumId(albumId);

            return this._serviceList.photos.post(params, newPhoto);
        },
        /** Will upload given File and finally return promise which nobody cares */
        upload: function(file, isUploadingBinding){
            const   binding     = this.binding.sub('album'),
                    albumId     = binding.get('id'),
                    imgService  = (window as any).Server.images;

            function startUploading(){
                isUploadingBinding.set(true);
            }
            function stopUploading(){
                isUploadingBinding.set(false);
            }

            startUploading();
            return imgService.upload(file)
                .then(this.photos._add.bind(this))
                .then(res => {
					stopUploading();
                    binding.sub('photos').update(photos => photos.unshift(Immutable.fromJS(res)));
                    if(!binding.get('coverUrl'))
                        return this.photo.pin(albumId, res.picUrl);
                })
                .catch(stopUploading);
        },
        /** will create new API Photo item and return promise of AJAX request
         * @private */
        _add:function(imgUrl) {
            const   ownerId     = this.binding.get('album.ownerId'),
                    albumId     = this.binding.get('album.id'),
                    model       = {
                    name:           "",
                    description:    "",
                    authorId:       ownerId,
                    picUrl:         imgUrl
                };
            return this.photos.post(albumId, model);
        }
    };
    this.photo = {
        "get":function(albumId, photoId){
            const params = this._getParamsWithAlbumId(albumId);
            params.photoId = photoId;

            return this._serviceList.photo.get(params);
        },
        put:function(albumId, photoId, model){
			const params = this._getParamsWithAlbumId(albumId);
            params.photoId = photoId;

            return this._serviceList.photo.put(params, model);
        },
        delete:function(albumId, photoId){
			const params = this._getParamsWithAlbumId(albumId);
            params.photoId = photoId;

            return this._serviceList.photo.delete(params);
        },
        pin:function(albumId, coverUrl){
            return this.album.put(albumId, {coverUrl:coverUrl});
        }
    };

	this._getParamsWithAlbumId = function(albumId){
		const params = Object.assign({}, this._params);
		if(albumId)
			params.albumId = albumId;

		return params;
	};
};