const   If          = require('module/ui/if/if'),
        Photo       = require('./photo_item'),
        React       = require('react'),
        Immutable   = require('immutable'),
        Gallery 	= require('../galleryServices');

const PhotoList = React.createClass({
    mixins: [Morearty.Mixin],
    propTypes: {
        onPhotoClick: React.PropTypes.func
    },
    componentWillMount: function() {
        var self = this,
            binding = self.getDefaultBinding();

        self.gallery = new Gallery(binding);
    },
    renderPhoto: function(photo, index) {
        var self = this,
        binding = self.getDefaultBinding(),
        photosBinding = binding.sub('photos'),
        photoBinding = photosBinding.sub(index),
        photoId = photoBinding.get("id");

        return (
            <Photo binding={photoBinding} key={'photo-' + photoId}
                    onPhotoClick={self.onPhotoClick}
                    onPhotoDelete={self.reloadPhotoList}
                    onPhotoPin={self.onPhotoPin}
            />
        );
    },

    onPhotoClick: function(photo) {
        const self = this;
        self.props.onPhotoClick(photo);
    },

    onPhotoPin: function(photo) {
        this.gallery.photoPin(photo.picUrl).then(function() {
            alert('Album cover is changed!');
        });
    },

    reloadPhotoList: function() {
        const self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            albumId = rootBinding.get('routing.pathParameters.1'),
            binding = self.getDefaultBinding(),
            schoolId    = rootBinding.get('userRules.activeSchoolId'),
            params      = {
                schoolId:schoolId,
                albumId:albumId
            };


        window.Server.schoolAlbumPhotos.get(params).then(function(res){
            binding
                .atomically()
                .set('photos', Immutable.fromJS(res))
                .commit();

        });
    },

    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            isUploading = self.getBinding('isUploading').get();

        return (
        <div className="bAlbums_list">
            <If condition={isUploading}>
                <div className="bAlbumPhoto mUploading">uploading...</div>
            </If>
            {binding.get('photos').map(self.renderPhoto)}
        </div>
      );
    }
});


module.exports = PhotoList;
