/**
 * Created by Anatoly on 14.05.2016.
 */

const   {AlbumRoutes}       = require('module/ui/gallery/albums'),
        galleryServices     = require('module/as_manager/pages/school_admin/gallery/schoolGalleryServices'),
        Morearty		    = require('morearty'),
        React		        = require('react');
/**
 * This component is required to initialize the base. We create here a necessary set of parameters for a school gallery.
 * */
const schoolGalleryRoutes = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId');

        self.service = galleryServices(binding, activeSchoolId);
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <AlbumRoutes basePath="school-albums" service={self.service} binding={binding} />
        );
    }
});

module.exports = schoolGalleryRoutes;
