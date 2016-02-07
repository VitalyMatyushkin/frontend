/**
 * Created by Bright on 07/02/2016.
 */
const   TypeMixin = require('module/ui/form/types/type_mixin'),
        className = require('classnames'),
        $         = require('jquery'),
        React = require('react');

const FileTypeUpload = React.createClass({
    mixins:[Morearty.Mixin, TypeMixin],
    propTypes:{
        typeOfFile:React.PropTypes.string
    },
    getInitialState:function(){
        return{
            fileLoading:true
        }
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('showLoadingGif',self.state.fileLoading);
        binding.addListener('defaultValue',function() {
            self.isMounted()&&self.setState({fileLoading:true},()=>{
                binding.set('showLoadingGif',self.state.fileLoading);
            });
            self.setValue(binding.get('defaultValue'));
        });
    },
    _inputFileChange:function(e){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            file = e.target.files[0];
        self.setState({fileLoading:false},function(){
            binding.set('showLoadingGif',self.state.fileLoading);
        });
        window.Server.addAlbum.post(rootBinding.get('userData.authorizationInfo.userId'), {
            name: 'blazon_'+rootBinding.get('userData.authorizationInfo.userId')+'_staging',
            description: 'blazon_'+rootBinding.get('userData.authorizationInfo.userId')+'_staging',
            eventId: rootBinding.get('userData.authorizationInfo.userId')
        }).then(function(res){
            let albumDetails=res;
            var formData = new FormData(),
                uri = window.apiBase + '/storage/sqt_album_1433792142221_a340185653dd693a37c8a502_staging',
                fileName = Math.random().toString(12).substring(7) + '.' + file.name.split('.')[1];
            formData.append('file', file, fileName);
            $.ajax({
                url: uri + '/upload',
                type: 'POST',
                success: function(res) {
                    self.setState({fileLoading:true});
                    var uploadedFile = res.result.files.file[0],
                        model = {
                            name: uploadedFile.name,
                            albumId: albumDetails.id,
                            description: uploadedFile.name,
                            authorId:albumDetails.ownerId,
                            pic: uri + '/files/' + uploadedFile.name
                        };
                    window.Server.photos.post(albumDetails.id, model).then(function(data){
                        binding.set('defaultValue','http:'+data.pic+'/contain?height=60&width=60');
                        return data;
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
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            gifClasses = className({
                'eLoader_gif':true,
                'eLoader_gif_hide':binding.get('showLoadingGif'),
                'eLoader_gif_show':!binding.get('showLoadingGif')
            });
        return (
            <div className="eForm_blazonUpload">
                <div className="eForm_blazonPreview">
                    <img src={binding.get('defaultValue')||'http://placehold.it/200x200'}/>
                    <div className={gifClasses}>
                        <img src="images/spin-loader-black.gif"/>
                    </div>
                </div>
                <div className="eForm_fileInput">
                    <input className="inputFile" name="file" id="file" type="file" onChange={self._inputFileChange}/>
                    <label className="labelForInputFile" htmlFor="file">Upload School Blazon</label>
                </div>
            </div>
        );
    }
});

module.exports = FileTypeUpload;