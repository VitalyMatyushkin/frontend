
const   React       = require('react'),
        Immutable   = require('immutable'),
        Popup       = require('module/ui/popup'),
        Album	    = require('module/ui/gallery/album/album_item');

const GalleryListPage = React.createClass({
    mixins:[Morearty.Mixin],
    getDefaultState:function(){
        return Immutable.Map({
            defaultAlbum: null
        });
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId');

        self.getDefaultSchoolAlbum();
    },
    componentDidMount:function(){

    },
    createAlbum:function(activeSchoolId){
        const self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();

        window.Server.addAlbum.post({
            name:'Default Album',
            description:'Default Album for school site',
            ownerId:rootBinding.get('userData.authorizationInfo.userId')
        }).then(album => {
            binding.set('defaultAlbum',album);
            self.updateSchool(activeSchoolId, album.id);
        });
    },
    loadAlbum:function(albumId){
        const self = this,
            binding = self.getDefaultBinding();

        window.Server.album.get(albumId).then(album => binding.set('defaultAlbum',album));
    },
    updateSchool:function(activeSchoolId, albumId){
        window.Server.school.put(activeSchoolId, {defaultAlbumId:albumId});
    },
    getDefaultSchoolAlbum:function(){
        const self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId');

        window.Server.school.get(activeSchoolId).then(school => {
            if(school){
                school.defaultAlbumId && self.loadAlbum(school.defaultAlbumId);
                !school.defaultAlbumId && self.createAlbum(activeSchoolId);
            }
        });
    },
    onClickAlbum: function(album) {
        const self = this;

        if (self.isMounted()) {
            document.location.hash = 'albums/view/' + album.id;
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div className="bSchoolGallery">
                <h2>School Gallery</h2>
                <Album binding={binding.sub('defaultAlbum')} onView={self.onClickAlbum} />
            </div>
        )
    }
});
module.exports = GalleryListPage;