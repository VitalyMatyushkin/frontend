/**
 * Created by bridark on 05/08/15.
 */
const   React       = require('react'),
        Immutable   = require('immutable'),
        Popup       = require('module/ui/popup');

const GalleryListPage = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return{albumPrompt:true}
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'); //console.log(binding.toJS());
        window.Server.addAlbum.get({
            filter:{
                where:{
                    //ownerId:activeSchoolId
                },
                include:'photos',
                limit:5
            }}).then(function(albums){
            binding.set('galleryList',Immutable.fromJS(albums));
            //console.log(binding.get('galleryList').toJS());
        });
    },
    _renderAlbumLists:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            albums = binding.toJS('galleryList');
        if(albums !== undefined && albums.length >= 1){
            return albums.map(function(album){
                //console.log(album);
                var styles = {};
                var handAlbumClick = function(){
                    return function(evt){
                        window.location.hash = '/photos?id='+album.id;
                        evt.stopPropagation();
                    }
                };
                if(album.photos !== undefined && album.photos.length >=1){
                    styles = {backgroundImage:'url('+album.photos[0].pic+')'}
                }else{
                    styles = {backgroundImage:'url(http://placehold.it/366x366'}
                }
                return(
                    <div onClick={handAlbumClick()} className="eEventAlbums_album bGalleryAlbums_album" style={styles}>
                        <span className="eEventAlbums_albumTitle">
                            {album.description}
                        </span>
                    </div>
                )
            });
        }else{
            return(
                <div><span>{'Sorry, there are no albums'}</span></div>
            )
        }
    },
    _handleCreateButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('albumPrompt',true);
    },
    _createNewAlbum:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            albumName = React.findDOMNode(self.refs.albumName).value,
            albumDesc = React.findDOMNode(self.refs.albumDesc).value;
        if(albumName !== '' && albumDesc !== ''){
            var albumModel = {
                name:albumName,
                description:albumDesc,
                ownerId:rootBinding.get('userRules.activeSchoolId'),
                storageId:'squadintouch_albums_staging'
            };
            window.Server.addAlbum.post(albumModel).then(function(albumDetails){
                console.log(albumDetails);
                binding.set('albumPrompt',false);
            });
        }else{
            alert('Please fill in name and description');
        }
    },
    _closePopup:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('albumPrompt',false);
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            albumLists = self._renderAlbumLists();
        return (
            <div className="bGalleryAlbumListContainer">
                <h2>Albums Gallery</h2>
                <h2>
                    <span onClick={self._handleCreateButtonClick.bind(null,this)} className="bButton">Create Album</span>
                </h2>
                <div className="bGalleryAlbums">
                    {albumLists}
                </div>
                <Popup stateProperty={'albumPrompt'} binding= {binding} onRequestClose={self._closePopup.bind(null,this)}>
                    <label className="bGalleryPromptLabel">Album Name:</label>
                    <input ref="albumName" className="bGalleryPromptInput" type="text" />
                    <label className="bGalleryPromptLabel">Description:</label>
                    <input ref="albumDesc" className="bGalleryPromptInput" type="text" />
                    <span onClick={self._createNewAlbum.bind(null,this)} className="bButton bGalleryPromptButton">Create</span>
                </Popup>
            </div>
        )
    }
});
module.exports = GalleryListPage;