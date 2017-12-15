/**
 * Created by Anatoly on 14.05.2016.
 */

const {galleryServices} = require('module/ui/gallery/galleryServices');

/**
 * General methods for the gallery.
 *
 * schoolGalleryServiceList {galleryServiceList} =
 * {
 *     albums:{Service},
 *     album:{Service},
 *     photos:{Service},
 *     photo:{Service}
 * }
 */


function schoolGalleryServices(binding, schoolId){
    const schoolGalleryServiceList = {
        albums:	null, // only one defaultAlbum
        album:	window.Server.schoolAlbum,
        photos:	window.Server.schoolAlbumPhotos,
        photo:	window.Server.schoolAlbumPhoto
    };

    return new galleryServices(binding, schoolGalleryServiceList, {schoolId:schoolId});
}

module.exports = schoolGalleryServices;