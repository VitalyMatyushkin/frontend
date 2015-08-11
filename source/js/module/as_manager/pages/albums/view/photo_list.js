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
            pic = photo.get('pic') + '/contain?height=50&width=100',
            styles = {backgroundImage: 'url(' + pic + ')'};

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
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            userId = rootBinding.get('userData.authorizationInfo.userId'),
            isOwner = userId !== binding.get('ownerId'); console.log(binding.toJS());

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
