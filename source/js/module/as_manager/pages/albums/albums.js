var RouterView = require('module/core/router'),
Route = require('module/core/route');

var AlbumRoutes = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		return (
			<RouterView routes={ binding } binding={binding}>
				<Route path="/albums/edit/:albumId" binding={binding} component="module/as_manager/pages/albums/view/album_edit"  />
				<Route path="/albums/create/:eventId" binding={binding} component="module/as_manager/pages/albums/view/album_create"  />
				<Route path="/albums/view/:albumId" binding={binding} component="module/as_manager/pages/albums/view/album_view"  />
			</RouterView>
		);
	}
});

module.exports = AlbumRoutes;
