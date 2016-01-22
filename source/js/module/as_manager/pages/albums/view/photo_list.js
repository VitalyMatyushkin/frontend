const   If          = require('module/ui/if/if'),
        AlbumPhoto  = require('./album_photo'),
        React       = require('react'),
        Immutable   = require('immutable');

const PhotoList = React.createClass({
    mixins: [Morearty.Mixin],
    propTypes: {
        onPhotoClick: React.PropTypes.func.required
    },
    getMergeStrategy: function() {
        return Morearty.MergeStrategy.MERGE_REPLACE;
    },
    renderPhoto: function(photo, index) {
        var self = this,
        binding = self.getDefaultBinding(),
        photosBinding = binding.sub('photos'),
        photoBinding = photosBinding.sub(index),
        photoid = photoBinding.get("id");

        return (
            <AlbumPhoto binding={photoBinding} key={'photo-' + photoid}
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
        const self = this,
            binding = self.getDefaultBinding(),
            photoId = photo.get('id');
        let album = binding.toJS();
        album.coverId = photoId;

        window.Server.album.put(album.id, album).then(function() {
            alert('Album cover is changed!');
        });
        return false;
    },

    reloadPhotoList: function() {
        const self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            albumId = rootBinding.get('routing.pathParameters.1'),
            binding = self.getDefaultBinding();

        window.Server.photos.get(albumId).then(function(res){
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
