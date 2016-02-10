/**
 * Created by Anatoly on 09.02.2016.
 */

'use strict';
const   FileUpload 		= require('module/ui/file_upload/file_upload'),
        Immutable		= require('immutable');

const galleryServices = function(albumBinding){
    this.binding = albumBinding;

    this.createAlbum = (model) => {
        return window.Server.addAlbum.post(model);
    };
    this.loadAlbum = (albumId) => {
        return window.Server.album.get(albumId);
    };
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
    this.updateSchool = (schoolId, albumId) => {
        return window.Server.school.put(schoolId, {defaultAlbumId:albumId});
    };
    this.getDefaultSchoolAlbum = (schoolId, ownerId) => {
        const self = this,
            binding = self.binding;
        let school;

        window.Server.school.get(schoolId).then(res => {
            school = res;
            if(school.defaultAlbumId)
                return self.loadAlbum(school.defaultAlbumId);
            else
                return self.createAlbum({
                    name:'Default Album',
                    description:'Default Album for school site',
                    ownerId:ownerId
                });
        }).then(album => {
            binding.set(album);
            if(!school.defaultAlbumId)
                return self.updateSchool(schoolId, album.id);
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
            if(!binding.get('coverUrl'))
                return self.photoPin(res.pic);
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