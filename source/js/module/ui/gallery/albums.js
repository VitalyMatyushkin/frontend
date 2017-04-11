/**
 * Created by Anatoly on 09.02.2016.
 */

const  	RouterView 	= require('module/core/router'),
		Route 		= require('module/core/route'),
		Morearty    = require('morearty'),
		React		= require('react'),
		AlbumEditComponent 		= require("module/ui/gallery/album/album_edit"),
		AlbumCreateComponent 	= require("module/ui/gallery/album/album_create"),
		AlbumViewComponent 		= require("module/ui/gallery/album/album_view"),
		PhotoEditComponent 		= require("module/ui/gallery/photo/photo_edit"),
		PhotoAddComponent 		= require("module/ui/gallery/photo/photo_add");


/**
 * The base component for routing the functions of the gallery.
 *
 * @param basePath {string} - Base path to the gallery. It depends on where the gallery is used.
 * For example, 'event-album/:eventId'
 *
 * @param service {galleryServices} - service for the work gallery with the server-API.
 * */
const AlbumRoutes = React.createClass({
	mixins: [Morearty.Mixin],
    propTypes:{
        basePath: React.PropTypes.string,
        service: React.PropTypes.object
    },
    getDefaultProps: function() {
        return {
            basePath: 'gallery-not-found'
        };
    },

	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<RouterView routes={ binding } binding={binding}>
				<Route path={"/" + self.props.basePath + "/edit/:albumId"} binding={binding} service={self.props.service} component={AlbumEditComponent}  />
				<Route path={"/" + self.props.basePath + "/create"} binding={binding} service={self.props.service} component={AlbumCreateComponent}  />
				<Route path={"/" + self.props.basePath + "/view/:albumId"} binding={binding} service={self.props.service} component={AlbumViewComponent}  />
				<Route path={"/" + self.props.basePath + "/view/:albumId/add"} binding={binding} service={self.props.service} component={PhotoAddComponent}  />
				<Route path={"/" + self.props.basePath + "/:albumId/photo-edit/:photoId"} service={self.props.service} binding={binding} component={PhotoEditComponent}  />
			</RouterView>
		);
	}
});

module.exports = AlbumRoutes;
