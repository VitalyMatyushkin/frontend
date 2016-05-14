const  	RouterView 	= require('module/core/router'),
		Route 		= require('module/core/route'),
		React		= require('react');

const AlbumRoutes = React.createClass({
	mixins: [Morearty.Mixin],
    propTypes:{
        basePath:React.PropTypes.string,
        service:React.PropTypes.object
    },
    getDefaultProps: function() {
        return {
            basePath:'gallery-not-found'
        };
    },

	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		return (
			<RouterView routes={ binding } binding={binding}>
				<Route path={"/" + self.props.basePath + "/edit/:albumId"} binding={binding} service={self.props.service} component="module/ui/gallery/album/album_edit"  />
				<Route path={"/" + self.props.basePath + "/create"} binding={binding} service={self.props.service} component="module/ui/gallery/album/album_create"  />
				<Route path={"/" + self.props.basePath + "/view/:albumId"} binding={binding} service={self.props.service} component="module/ui/gallery/album/album_view"  />
				<Route path={"/" + self.props.basePath + "/:albumId/photo-edit/:photoId"} service={self.props.service} binding={binding} component="module/ui/gallery/photo/photo_edit"  />
			</RouterView>
		);
	}
});

module.exports = AlbumRoutes;
