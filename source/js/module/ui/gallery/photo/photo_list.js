const   If          = require('module/ui/if/if'),
        Photo       = require('./photo_item'),
        React       = require('react'),
        Morearty    = require('morearty'),
        Immutable   = require('immutable');

const PhotoList = React.createClass({
    mixins: [Morearty.Mixin],
    propTypes: {
        onPhotoClick: React.PropTypes.func,
        service:React.PropTypes.object
    },
    componentWillMount: function() {
        var self = this;

        self.service = self.props.service;
    },
    renderPhoto: function(photo, index) {
        var self = this,
        binding = self.getDefaultBinding(),
        photosBinding = binding.sub('photos'),
        photoBinding = photosBinding.sub(index),
        photoId = photoBinding.get("id");

        return (
            <Photo  binding={photoBinding} key={'photo-' + photoId}
                    onPhotoClick={self.onPhotoClick}
                    reloadPhotoList={self.reloadPhotoList}
                    onPhotoPin={self.onPhotoPin}
                    service = {self.service}
            />
        );
    },

    onPhotoClick: function(photo) {
        const self = this;
        self.props.onPhotoClick(photo);
    },

    onPhotoPin: function(photo) {
        const 	self 	= this,
            	binding = self.getDefaultBinding(),
            	albumId = binding.get('id');

        this.service.photo.pin(albumId, photo.picUrl).then(function() {
            window.simpleAlert(
                'Album cover is changed!',
                'Ok',
                () => {}
            );
        });
    },

    reloadPhotoList: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding(),
				albumId = binding.get('id');

        return this.service.photos.get(albumId,{filter:{limit: 100}}).then(function(res){
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
