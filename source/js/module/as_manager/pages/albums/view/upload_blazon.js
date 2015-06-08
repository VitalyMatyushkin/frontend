/**
 * Created by bridark on 08/06/15.
 */
var If = require('module/ui/if/if'),
    BlazonUpload,
    urlStr,
    albumDetails={};

BlazonUpload = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount:function(){
        var self = this;
        self._updatePhotoUpload();
    },
    _updatePhotoUpload:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        window.Server.addAlbum.post(rootBinding.get('userRules.activeSchoolId'), {
            name: 'blazon_'+rootBinding.get('userRules.activeSchoolId')+'_staging',
            description: 'blazon_'+rootBinding.get('userRules.activeSchoolId')+'_staging',
            eventId: rootBinding.get('userRules.activeSchoolId')
        }).then(function(res){
            albumDetails=res; console.log(albumDetails.storageId); console.log(albumDetails);
        });
    },
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

        return <div key={'photo-' + index} className={classes} style={styles}></div>;
    },
    handleFile: function(e) {
        var self = this,
            binding = self.getDefaultBinding(),
        //self._updatePhotoUpload();
            file = e.target.files[0],
            formData = new FormData(),
            uri = window.apiBase + '/storage/sqt_album_1433792142221_a340185653dd693a37c8a502_staging',
            fileName = Math.random().toString(12).substring(7) + '.' + file.name.split('.')[1];
        formData.append('file', file, fileName);
        console.log(uri); console.log(fileName);
        $.ajax({
            url: uri + '/upload',
            type: 'POST',
            success: function(res) {
                var uploadedFile = res.result.files.file[0],
                    model = {
                        name: uploadedFile.name,
                        albumId: albumDetails.id,
                        description: uploadedFile.name,
                        authorId:albumDetails.ownerId,
                        pic: uri + '/files/' + uploadedFile.name
                    };
                console.log(albumDetails.id);
                Server.photos.post(albumDetails.id, model).then(function(data){
                    console.log(data);
                    urlStr = 'http:'+uri+'/files/'+fileName+'/contain?height=50&width=100';
                    var profilePicStr = document.getElementById('blazonInput');
                    profilePicStr.value =urlStr;
                });

                //setTimeout(function() {
                //    binding.sub('photos').update(function(photos) {
                //        return photos.push(Immutable.fromJS(model));
                //    });
                //
                //    if (!binding.get('currentPhotoId')) {
                //        binding.set('currentPhotoId', binding.get('photos.0.id'));
                //    }
                //}, 1000);

            },
            // Form data
            data: formData,
            //Options to tell jQuery not to process data or worry about content-type.
            cache: false,
            contentType: false,
            processData: false
        });
    },
    componentDidUpdate:function(){

    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            userId = rootBinding.get('userData.authorizationInfo.userId'),
            isOwner = userId !== binding.get('ownerId');

        return <div className="bAlbums_list">
            <If condition={isOwner}>
                <div className="eAlbums_photo mUpload">+
                    <input onChange={self.handleFile} type="file" className="eAlbums_input eBlazon_input"/>
                </div>
            </If>
            {(typeof binding.get('photos')!=='undefined')? binding.get('photos').map(self.renderPhoto.bind(self)) : ''}
        </div>;
    }
});


module.exports = BlazonUpload;
