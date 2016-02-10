/**
 * Created by Anatoly on 09.02.2016.
 */

'use strict';
const   FileUpload 		= require('module/ui/file_upload/file_upload'),
        Immutable		= require('immutable');

const galleryServices = function(albumBinding){
    this.binding = albumBinding;

    this.loadAlbumWithPhotos = (albumId) =>{
        return window.Server.album.get(albumId, {
            filter: {
                include: {
                    relation: 'photos',
                    scope: {
                        order: 'meta.created DESC'
                    }
                }
            }
        });
    };

    this.uploadPhoto = (file, isUploadingBinding) => {
        const self = this,
            binding = self.binding,
            formData = new FormData(),
            uri = window.apiBase + '/storage/' + binding.get('storageId'),
            fileName = Math.random().toString(12).substring(7) + '.' + file.name.split('.')[1],
            uploader = new FileUpload(uri); //Instantiate new file upload service

        function startUploading(){
            isUploadingBinding.set(true);
        }
        function stopUploading(){
            isUploadingBinding.set(false);
        }

        formData.append('file', file, fileName);
        startUploading();
        uploader.post(formData)
        .then(function(data){
            return self._addPhoto(data);
        })
        .catch(function(data){
            window.alert(data+' Please try again!');
            stopUploading();
        })
        .then(function(res) {
            stopUploading();
            binding.sub('photos').update(function(photos) {
                return photos.unshift(Immutable.fromJS(res));
            });
            !binding.get('coverUrl') && self.photoPin(res.pic).then();
        });
    };

    this._addPhoto = (fileModel) => {
        const albumId = this.binding.get('id'),
            ownerId = this.binding.get('ownerId'),
            uri = window.apiBase + '/storage/' + this.binding.get('storageId'),
            model = {
                name: fileModel.name,
                albumId: albumId,
                description: fileModel.name,
                authorId: ownerId,
                pic: uri + '/files/' + fileModel.name
            };
        return window.Server.photos.post(albumId, model);
    };

    this.photoPin = (coverUrl) => {
        return window.Server.album.put(this.binding.get('id'), {coverUrl:coverUrl});
    };
};

module.exports = galleryServices;