const  	RouterView 	= require('module/core/router'),
		Route 		= require('module/core/route'),
		React		= require('react');

const AlbumRoutes = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		return (
			<RouterView routes={ binding } binding={binding}>
				<Route path="/albums/edit/:albumId" binding={binding} component="module/ui/gallery/album/album_edit"  />
				<Route path="/albums/create/:eventId" binding={binding} component="module/ui/gallery/album/album_create"  />
				<Route path="/albums/view/:albumId" binding={binding} component="module/ui/gallery/album/album_view"  />
				<Route path="/albums/:albumId/photo-edit/:photoId" binding={binding} component="module/ui/gallery/photo/photo_edit"  />
			</RouterView>
		);
	}
});

module.exports = AlbumRoutes;
