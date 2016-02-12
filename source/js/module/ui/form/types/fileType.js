/**
 * Created by Bright on 07/02/2016.
 */
const   TypeMixin = require('module/ui/form/types/type_mixin'),
        className = require('classnames'),
        Immutable = require('immutable'),
        $         = require('jquery'),
        FileUpload 		= require('module/ui/file_upload/file_upload'),
        React = require('react');

const FileTypeUpload = React.createClass({
    mixins:[Morearty.Mixin, TypeMixin],
    propTypes:{
        typeOfFile:React.PropTypes.string,
        labelText: React.PropTypes.string
    },
    getDefaultState: function () {
        return Immutable.fromJS({
            fileLoading:true
        });
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            routingData = globalBinding.sub('routing.parameters').toJS(),
            schoolId = routingData.id;
        //TODO:may be an overkill but this removes the potential bug of using hardcoded URL
        window.Server.addAlbum.get({filter:{where:{ownerId:schoolId}}})
            .then(function (schoolProfileAlbum) {
                /**By default there are more than one because it would use the default global activeSchoolId - this happens if the action
                  being performed is to add a new school
                  If school has no album for profile pictures it will return all albums in database with default activeSchoolId
                  or 0 if school exists, has no album and action is edit
                 * */
                if(schoolProfileAlbum.length > 1 || schoolProfileAlbum.length == 0){
                    //Then get the temporary album
                   self._getNewTempAlbum();
                }else{
                    //Then the current action is edit and school has blazon_album
                    binding.set('albumStorage', Immutable.fromJS(schoolProfileAlbum));
                }
                return schoolProfileAlbum;
            })
            .catch(function (err) {
                alert(err.errorThrown+' occurred while getting school album');
            });
        binding.addListener('defaultValue',function() {
            self.setValue(binding.get('defaultValue'));
        });
    },
    _getNewTempAlbum:function(){
        var self = this,
            binding = self.getDefaultBinding();
        /**Get the temporary album for storing profile images for new schools
        *Use this to hold profile pictures for newly added schools*/
        window.Server.addAlbum.get({filter:{where:{name:'tempBlazonAlbum'}}}).then(function (tempStorage) {
            //If it doesn't exist, it will return an array of size 0
            if(tempStorage.length < 1){
                //then create one
                window.Server.addAlbum.post({name:'tempBlazonAlbum', ownerId:'superadmin'}).then(function(newOne){
                    binding.set('albumStorage', Immutable.fromJS(newOne));
                    return newOne;
                })
            }else{
                //If it does then bind it to component
                binding.set('albumStorage', Immutable.fromJS(tempStorage));
            }
            return tempStorage;
        });
    },
    _inputFileChange:function(e){
        var self = this,
            binding = self.getDefaultBinding(),
            formData = new FormData(),
            uri = window.apiBase + '/storage/' + binding.get('albumStorage.0.storageId'),
            file = e.target.files[0],
            fileName = Math.random().toString(12).substring(7) + '.' + file.name.split('.')[1];
        formData.append('file', file, fileName);
        binding.atomically().set('fileLoading',false).commit();
        let imageUploader = new FileUpload(uri);
        imageUploader.post(formData).then(function(res){
            var uploadedFile = res,
                model = {
                    name: uploadedFile.name,
                    albumId: binding.get('albumStorage.0.id'),
                    description: uploadedFile.name,
                    authorId:binding.get('albumStorage.0.ownerId'),
                    pic: uri + '/files/' + uploadedFile.name
                };
            window.Server.photos.post(binding.get('albumStorage.0.id'), model).then(function(data){
                binding.set('defaultValue','http:'+data.pic+'/contain?height=60&width=60');
                binding.atomically().set('fileLoading',true).commit();
                return data;
            });
            return res;
        }).catch(function(err){alert(err.errorThrown+' occurred while posting image to storage');});
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            gifClasses = className({
                'eLoader_gif':true,
                'eLoader_gif_hide':binding.get('fileLoading'),
                'eLoader_gif_show':!binding.get('fileLoading')
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
                    <label className="labelForInputFile" htmlFor="file">{self.props.labelText || 'Default'}</label>
                </div>
            </div>
        );
    }
});

module.exports = FileTypeUpload;