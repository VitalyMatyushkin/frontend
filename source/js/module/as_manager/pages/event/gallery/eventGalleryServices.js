/**
 * Created by Anatoly on 14.05.2016.
 */

const galleryServices     = require('module/ui/gallery/galleryServices');



function eventGalleryServices(binding, schoolId, eventId){
    /**
     * General methods for the gallery.
     *
     * eventGalleryServiceList {galleryServiceList} =
     * {
     *     albums:{Service},
     *     album:{Service},
     *     photos:{Service},
     *     photo:{Service}
     * }
     */
    const eventGalleryServiceList = {
        albums:  window.Server.schoolEventAlbums,
        album:   window.Server.schoolEventAlbum,
        photos:  window.Server.schoolEventAlbumPhotos,
        photo:   window.Server.schoolEventAlbumPhoto
    };

    return new galleryServices(binding, eventGalleryServiceList, {schoolId:schoolId, eventId:eventId});
}

module.exports = eventGalleryServices;