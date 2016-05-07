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
    this.loadAlbum = function(schoolId, albumId){
        return window.Server.schoolAlbum.get({schoolId:schoolId, albumId:albumId});
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
    this.getDefaultSchoolAlbum = function(schoolId, ownerId){
        const self = this;

        window.Server.school.get(schoolId).then(school => {
            if(school.defaultAlbumId)
                return self.loadAlbum(schoolId, school.defaultAlbumId);
            else{
                console.error('school.defaultAlbumId is undefined')
                return null;
            }
        }).then(album => {
            self.binding.set(album);
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
                schoolId    = this.binding.get('schoolId'),
                params      = {schoolId:schoolId, albumId:albumId},
                model       = {
                    name:           "",
                    description:    "",
                    authorId:       ownerId,
                    picUrl:         imgUrl
                };
        return window.Server.schoolAlbumPhotos.post(params, model);
    };

    this.photoPin = function(coverUrl){
        const   albumId     = this.binding.get('id'),
                schoolId    = this.binding.get('schoolId'),
                params      = {schoolId:schoolId, albumId:albumId};

        return window.Server.schoolAlbum.put(params, {coverUrl:coverUrl});
    };
};

module.exports = galleryServices;