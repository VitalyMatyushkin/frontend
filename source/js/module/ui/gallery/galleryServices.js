/**
 * Created by Anatoly on 09.02.2016.
 */

'use strict';
const   Immutable		= require('immutable');

/**
 * General methods for the gallery.
 *
 * @param albumBinding {object} - Morearty default binding
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
 *
 *
 */
const galleryServices = function(albumBinding, galleryServiceList, params){
    const self = this;

    self.binding = albumBinding;
    self._serviceList = galleryServiceList;
    self._params = params;

    self.setAlbumId = function(albumId){
        self._params.albumId = albumId;
    };
    self.albums = {
        "get":function(){
            return self._serviceList.albums.get(self._params);
        },
        post:function(newAlbum){
            return self._serviceList.albums.post(self._params, newAlbum);
        }
    };
    self.album = {
        "get":function(albumId){
            const params = Object.assign({}, self._params);
            params.albumId = albumId;

            return self._serviceList.album.get(params);
        },
        put:function(albumId, model){
            const params = Object.assign({}, self._params);
            params.albumId = albumId;

            return self._serviceList.album.put(params, model);
        },
        delete:function(albumId){
            const params = Object.assign({}, self._params);
            params.albumId = albumId;

            return self._serviceList.album.delete(params);
        }
    };
    self.photos = {
        "get": function () {
            return self._serviceList.photos.get(self._params);
        },
        post: function (newPhoto) {
            return self._serviceList.photos.post(self._params, newPhoto);
        },
        /** Will upload given File and finally return promise which nobody cares */
        upload: function(file, isUploadingBinding){
            const   self        = this,
                binding     = self.binding,
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
                    binding.sub('photos').update(photos => photos.unshift(Immutable.fromJS(res)));
                    if(!binding.get('coverUrl'))
                        return self.photo.pin(res.pic);
                })
                .finally(stopUploading);
        },
        /** will create new API Photo item and return promise of AJAX request
         * @private */
        _add:function(imgUrl) {
            const   ownerId     = self.binding.get('ownerId'),
                    model       = {
                    name:           "",
                    description:    "",
                    authorId:       ownerId,
                    picUrl:         imgUrl
                };
            return self.photos.post(model);
        }
    };
    self.photo = {
        "get":function(photoId){
            const params = Object.assign({}, self._params);
            params.photoId = photoId;

            return self._serviceList.photo.get(params);
        },
        put:function(photoId, model){
            const params = Object.assign({}, self._params);
            params.photoId = photoId;

            return self._serviceList.photo.put(params, model);
        },
        delete:function(photoId){
            const params = Object.assign({}, self._params);
            params.photoId = photoId;

            return self._serviceList.photo.delete(params);
        },
        pin:function(albumId, coverUrl){
            return self.album.put(albumId, {coverUrl:coverUrl});
        }
    };
};

module.exports = galleryServices;