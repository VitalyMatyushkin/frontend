/**
 * Created by bridark on 05/08/15.
 */
const   Popup       = require('module/ui/popup'),
        SubMenu     = require('module/ui/menu/sub_menu'),
        React       = require('react'),
        If          = require('module/ui/if/if'),
        $           = require('jquery'),
        Immutable   = require('immutable');

const AddToGallery = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return {
            expandView: false
        }
    },

    componentWillMount:function(){
        const   self            = this,
                binding         = self.getDefaultBinding(),
                rootBinding     = self.getMoreartyContext().getBinding(),
                activeAlbumId   = rootBinding.get('routing.parameters.id');

        self.currentAlbumId = activeAlbumId;
        self.currentSchoolId = rootBinding.get('userRules.activeSchoolId');
        self.menuItems = [{
            key: 'goback',
            name: '← BACK TO ALBUM GALLERY',
            href: '#'
        }];
        window.Server.albumsFindOne.get({filter:{
            where:{
                id:activeAlbumId
            },
            include:'photos'
        }}).then(function(res){
            binding.set('photoList',Immutable.fromJS(res));
        });
        self.expandView = false;
    },

    _renderPhotoGrid:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            album = binding.toJS('photoList');
        if(album !== undefined && album.photos !== undefined){
            if(album.photos.length >=1){
                return album.photos.map(function(photo){
                    var styles = {backgroundImage:'url('+photo.pic+')'};
                    var handAlbumClick = function(imgUrl){
                        return function(evt){
                            self.imgSrc = imgUrl;
                            self.expandView = true;
                            binding.set('albumPrompt',true);
                            evt.stopPropagation();
                        }
                    };
                    return(
                        <div onClick={handAlbumClick(photo.pic)} className="eEventAlbums_album bGalleryAlbums_photos" style={styles}>
                            <span className="eEventAlbums_albumTitle">
                                {photo.name}
                            </span>
                        </div>
                    )
                });
            }
            else{
                return(
                    <div><span>{'Sorry, there seem to be no photos in this album'}</span></div>
                )
            }
        }
    },
    _handleAddButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('albumPrompt',true);
    },
    _closePopup:function(){
        var self = this,
            binding = self.getDefaultBinding();
        self.expandView = false;
        binding.set('albumPrompt',false);
    },
    handleFile: function(e) {
        var self = this,
            binding = self.getDefaultBinding(),
            file = e.target.files[0],
            formData = new FormData(),
            uri = window.apiBase + '/storage/squadintouch_albums_staging',
            fileName = Math.random().toString(12).substring(7) + '.' + file.name.split('.')[1];
        formData.append('file', file, fileName);
        // TODO: use promised version instead
        $.ajax({
            url: uri + '/upload',
            type: 'POST',
            success: function(res) {
                var uploadedFile = res.result.files.file[0],
                    model = {
                        name: uploadedFile.name,
                        albumId: self.currentAlbumId,
                        description: uploadedFile.name,
                        authorId: self.currentSchoolId,
                        pic: uri + '/files/' + uploadedFile.name
                    };
                window.Server.photos.post(self.currentAlbumId, model);
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
    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                photoLists  = self._renderPhotoGrid();
        return (
            <div className="bGalleryAlbumListContainer">
                <SubMenu binding={binding.sub('galleryList')} items={self.menuItems} />
                <div className="bGalleryPhotoGrid">
                    <h2>Grid of Photos in Album</h2>
                    <h2>
                        <span onClick={self._handleAddButtonClick.bind(null,this)} className="bButton">Add a photo</span>
                    </h2>
                    <div className="bGalleryAlbums">
                        {photoLists}
                    </div>
                    <If condition={self.expandView === false}>
                        <Popup stateProperty={'albumPrompt'} binding= {binding} onRequestClose={self._closePopup.bind(null,this)}>
                            <input className="photoUploadInput" onChange={self.handleFile} type="file" />
                            <span onClick={self._closePopup.bind(null,this)} className="bButton bGalleryPromptButton">Cancel</span>
                        </Popup>
                    </If>
                    <If condition={self.expandView !== false}>
                        <Popup stateProperty={'albumPrompt'} otherClass="bGalleryPhotoExpanded" binding={binding} onRequestClose={self._closePopup.bind(null,this)}>
                            <div className="expandContainer">
                                <img src={self.imgSrc} />
                            </div>
                        </Popup>
                    </If>
                </div>
            </div>
        )
    }
});
module.exports = AddToGallery;