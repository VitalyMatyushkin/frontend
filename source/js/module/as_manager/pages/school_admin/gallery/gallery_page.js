
const   React       = require('react'),
        Immutable   = require('immutable'),
        Popup       = require('module/ui/popup'),
        Album	    = require('module/ui/gallery/album/album_item'),
        Gallery 	= require('module/ui/gallery/galleryServices');

const GalleryListPage = React.createClass({
    mixins:[Morearty.Mixin],
    getDefaultState:function(){
        return Immutable.Map({
            defaultAlbum: null
        });
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
            userId = rootBinding.get('userData.authorizationInfo.userId');

        self.gallery = new Gallery(binding.sub('defaultAlbum'));
        self.gallery.getDefaultSchoolAlbum(activeSchoolId, userId);
    },
    onClickAlbum: function(album) {
            document.location.hash = 'albums/view/' + album.id;
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (

            <div className="bSchoolGallery">
                <div className="eSchoolMaster_wrap">
                    <h1 className="eSchoolMaster_title">Gallery</h1>
                    <div className="eStrip"></div>
                    <h1 className="showAllPhoto">All</h1>
                </div>
                <div className="albums_wrap">
                    <Album binding={binding.sub('defaultAlbum')} onView={self.onClickAlbum} />
                </div>
            </div>
        )
    }
});
module.exports = GalleryListPage;