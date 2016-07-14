
const   React       = require('react'),
        Immutable   = require('immutable'),
        Morearty	= require('morearty'),
        Album	    = require('module/ui/gallery/album/album_item');

const GalleryListPage = React.createClass({
    mixins:[Morearty.Mixin],
    getDefaultState:function(){
        return Immutable.Map({
            defaultAlbum: null
        });
    },
    componentWillMount:function(){
        var self 			= this,
            rootBinding 	= self.getMoreartyContext().getBinding(),
            activeSchoolId 	= rootBinding.get('userRules.activeSchoolId'),
            userId 			= rootBinding.get('userData.authorizationInfo.userId'),
			role 			= rootBinding.get('userData.authorizationInfo.role');
		if(role !== "ADMIN" && role !== "MANAGER")
			document.location.hash = 'school_admin/summary';
		else
			self.getDefaultSchoolAlbum(activeSchoolId);
    },
    getDefaultSchoolAlbum:function(schoolId){
        var self = this,
            binding = self.getDefaultBinding();

        window.Server.school.get(schoolId).then(school => {
            if(school.defaultAlbumId)
                return window.Server.schoolAlbum.get({schoolId:schoolId, albumId:school.defaultAlbumId});
            else{
                console.error('school.defaultAlbumId is undefined')
                return null;
            }
        }).then(album => {
            binding.set('defaultAlbum', album);
        });
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (

            <div className="bSchoolGallery">
                <div className="eSchoolMaster_wrap">
                    <h1 className="eSchoolMaster_title">Gallery</h1>
                    <div className="eStrip"></div>
                    <h1 className="showAllPhoto">All</h1>
                </div>
                <div className="albums_wrap">
                    <Album binding={binding.sub('defaultAlbum')} basePath="school-albums" />
                </div>
            </div>
        )
    }
});
module.exports = GalleryListPage;