var If = require('module/ui/if/if'),
    AlbumPhoto = require('./album_photo');

var PhotoList = React.createClass({
  mixins: [Morearty.Mixin],
  renderPhoto: function(photo, index) {
    var self = this,
    binding = this.getDefaultBinding(),
    photosBinding = binding.sub('photos'),
    photoBinding = photosBinding.sub(index);

    return (
      <AlbumPhoto binding={photoBinding} key={'photo-' + index} onPhotoClick={self.onPhotoClick} />
    );
  },

  onPhotoClick: function(photo) {
    var self = this;
    self.props.onPhotoClick(photo);
  },



    handleFile: function(e) {
      var self = this,
      binding = self.getDefaultBinding(),
      file = e.target.files[0],
      formData = new FormData(),
      uri = window.apiBase + '/storage/' + binding.get('storageId'),
      fileName = Math.random().toString(12).substring(7) + '.' + file.name.split('.')[1];

      formData.append('file', file, fileName);

      $.ajax({
        url: uri + '/upload',
        type: 'POST',
        success: function(res) {
          var uploadedFile = res.result.files.file[0],
              model = {
                  name: uploadedFile.name,
                  albumId: binding.get('id'),
                  description: uploadedFile.name,
                  authorId: binding.get('ownerId'),
                  pic: uri + '/files/' + uploadedFile.name
              };

          Server.photos.post(binding.get('id'), model);

          setTimeout(function() {
              binding.sub('photos').update(function(photos) {
                  return photos.push(Immutable.fromJS(model));
              });

              if (!binding.get('currentPhotoId')) {
                  binding.set('currentPhotoId', binding.get('photos.0.id'));
              }
          }, 1000);
        },
        // Form data
        data: formData,
        //Options to tell jQuery not to process data or worry about content-type.
        cache: false,
        contentType: false,
        processData: false
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
