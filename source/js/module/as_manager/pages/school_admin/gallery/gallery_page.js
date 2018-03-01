
const   React       	= require('react'),
        Morearty		= require('morearty'),
		galleryServices = require('module/as_manager/pages/school_admin/gallery/schoolGalleryServices'),
		{Album}	    	= require('module/ui/gallery/album/album_item');

const GalleryListPage = React.createClass({
    mixins:[Morearty.Mixin],

    render:function(){
        const   binding         = this.getDefaultBinding(),
		        rootBinding 	= this.getMoreartyContext().getBinding(),
		        activeSchoolId 	= rootBinding.get('userRules.activeSchoolId'),
	            service         = galleryServices(this.getDefaultBinding(), activeSchoolId);

        return (
            <div className="bSchoolGallery">
                <Album
                    binding={binding.sub('defaultAlbum')}
                    basePath="school-albums"
                    activeSchoolId={activeSchoolId}
                    service={service}
                />
            </div>
        )
    }
});
module.exports = GalleryListPage;