var If = require('module/ui/if/if'),
    AlbumPhoto = require('./album_photo');

var PhotoList = React.createClass({
    mixins: [Morearty.Mixin],
    getMergeStrategy: function() {
        return Morearty.MergeStrategy.MERGE_REPLACE;
    },
    renderPhoto: function(photo, index) {
        var self = this,
        binding = this.getDefaultBinding(),
        photosBinding = binding.sub('photos'),
        photoBinding = photosBinding.sub(index);

        return (
            <AlbumPhoto binding={photoBinding} key={'photo-' + index}
                      onPhotoClick={self.onPhotoClick}
                      onPhotoDelete={self.reloadPhotoList}
            />
        );
    },

    onPhotoClick: function(photo) {
    var self = this;
    self.props.onPhotoClick(photo);
    },

    reloadPhotoList: function() {
        var self = this,
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
      binding = self.getDefaultBinding();


      return (
        <div className="bAlbums_list">
          {binding.get('photos').map(self.renderPhoto)}
        </div>
      );
    }
});


module.exports = PhotoList;
