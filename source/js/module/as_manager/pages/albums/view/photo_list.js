var If = require('module/ui/if/if'),
    PhotoList;

PhotoList = React.createClass({
    mixins: [Morearty.Mixin],
    renderPhoto: function(photo, index) {
        var self = this,
            binding = self.getDefaultBinding(),
            currentPhotoId = binding.get('currentPhotoId') || binding.get('photos.0.id'),
            classes = classNames({
                mActive: currentPhotoId === photo.get('id'),
                'eAlbums_photo': true
            }),
            styles = {backgroundImage: 'url(' + photo.get('pic') + ')'};

        return <div onClick={self.onClickPhoto.bind(null, photo)} key={'photo-' + index} className={classes}
                    style={styles}></div>;
    },
    onClickPhoto: function(photo) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('currentPhotoId', photo.get('id'));
    },
    handleFile: function(e) {
        var self = this,
            binding = self.getDefaultBinding(),
            file = e.target.files[0],
            formData = new FormData(),
            uri = '//api.squadintouch.com/v1/storage/' + binding.get('storageId'),
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
                        pic: uri + '/download/' + uploadedFile.name
                    };

                Server.photos.post(binding.get('id'), model);

                model.pic = URL.createObjectURL(file);
                binding.sub('photos').update(function(photos) {
                    return photos.push(Immutable.fromJS(model));
                });

                if (!binding.get('currentPhotoId')) {
                    binding.set('currentPhotoId', binding.get('photos.0.id'));
                }
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
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            userId = rootBinding.get('userData.authorizationInfo.userId'),
            isOwner = userId !== binding.get('ownerId');

        return <div className="bAlbums_list">
            <If condition={isOwner}>
                <div className="eAlbums_photo mUpload">+<input onChange={self.handleFile} type="file"
                                                               className="eAlbums_input"/></div>
            </If>
            {binding.get('photos').map(self.renderPhoto.bind(self))}
        </div>;
    }
});


module.exports = PhotoList;
