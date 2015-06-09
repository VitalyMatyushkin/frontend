/**
 * Created by bridark on 08/06/15.
 */
var If = require('module/ui/if/if'),
    BlazonUpload,
    urlStr,
    preview,
    albumDetails={};

BlazonUpload = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        window.Server.school.get(rootBinding.get('userRules.activeSchoolId')).then(function(school){
            console.log(school);
            preview = self.renderPhoto(school.pic);
        });
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
            albumDetails=res;
        });
    },
    renderPhoto: function(imgSrc) {
        var self = this,
            classes = classNames({
                'eAlbums_photo': true,
                'eAlbum_ext':true
            }),
            styles = {backgroundImage: 'url(' + imgSrc + ')'};
        return <div className={classes} style={styles}></div>
    },
    handleFile: function(e) {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        var file = e.target.files[0];
        window.Server.addAlbum.post(rootBinding.get('userRules.activeSchoolId'), {
            name: 'blazon_'+rootBinding.get('userRules.activeSchoolId')+'_staging',
            description: 'blazon_'+rootBinding.get('userRules.activeSchoolId')+'_staging',
            eventId: rootBinding.get('userRules.activeSchoolId')
        }).then(function(res){
            albumDetails=res;
            var formData = new FormData(),
                uri = window.apiBase + '/storage/sqt_album_1433792142221_a340185653dd693a37c8a502_staging',
                fileName = Math.random().toString(12).substring(7) + '.' + file.name.split('.')[1];
            formData.append('file', file, fileName);
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
                    Server.photos.post(albumDetails.id, model).then(function(data){
                        urlStr = 'http:'+uri+'/files/'+fileName+'/contain?height=60&width=60';
                        var profilePicStr = document.getElementById('blazonInput');
                        profilePicStr.value =urlStr;
                    });
                },
                // Form data
                data: formData,
                //Options to tell jQuery not to process data or worry about content-type.
                cache: false,
                contentType: false,
                processData: false
            });
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
                <div className="eAlbums_photo mUpload">+
                    <input onChange={self.handleFile} type="file" className="eAlbums_input eBlazon_input"/>
                </div>
            </If>
            <div>{preview}</div>
        </div>;
    }
});


module.exports = BlazonUpload;
