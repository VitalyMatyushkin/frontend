/**
 * Created by Anatoly on 14.05.2016.
 */

const   AlbumRoutes         = require('module/ui/gallery/albums'),
        galleryServices     = require('module/as_manager/pages/event/gallery/eventGalleryServices'),
        Morearty		    = require('morearty'),
        React		        = require('react');

/**
 * This component is required to initialize the base. We create here a necessary set of parameters for a event gallery.
 * */
const eventGalleryRoutes = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			eventId = rootBinding.toJS('routing.pathParameters.0');

        self.service = galleryServices(binding, activeSchoolId, eventId);
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <AlbumRoutes basePath="event-albums/:eventId" service={self.service} binding={binding} />
        );
    }
});

module.exports = eventGalleryRoutes;
