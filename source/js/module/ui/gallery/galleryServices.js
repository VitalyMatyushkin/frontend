/**
 * Created by Anatoly on 09.02.2016.
 */

'use strict';
const   FileUpload 		= require('module/ui/file_upload/file_upload'),
        Immutable		= require('immutable');

const galleryServices = function(albumBinding){
    this.binding = albumBinding;

    this.createAlbum = function(model){
        return window.Server.addAlbum.post(model);
    };
    this.loadAlbum = function(albumId){
        return window.Server.album.get(albumId);
    };
    this.loadAlbumWithPhotos = function(albumId){
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
    this.updateSchool = function(schoolId, albumId){
        return window.Server.school.put(schoolId, {defaultAlbumId:albumId});
    };
    this.getDefaultSchoolAlbum = function(schoolId, ownerId){
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

    /** Will upload given File and finally return promise which nobody cares */
    this.uploadPhoto = function(file, isUploadingBinding){
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
            .then(self._addPhoto.bind(this))
            .then(res => {
                binding.sub('photos').update(photos => photos.unshift(Immutable.fromJS(res)));
                if(!binding.get('coverUrl'))
                    return self.photoPin(res.pic);
            })
            .finally(stopUploading);
    };

    /** will create new API Photo item and return promise of AJAX request */
    this._addPhoto = function(imgUrl) {
        const   albumId     = this.binding.get('id'),
                ownerId     = this.binding.get('ownerId'),
                model       = {
                    name:           "MyNameIs",
                    albumId:        albumId,
                    description:    "",
                    authorId:       ownerId,
                    pic:            imgUrl
                };
        return window.Server.photos.post(albumId, model);
    };

    this.photoPin = function(coverUrl){
        return window.Server.album.put(this.binding.get('id'), {coverUrl:coverUrl});
    };
};

module.exports = galleryServices;