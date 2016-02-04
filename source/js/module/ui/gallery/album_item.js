const 	React 			= require('react'),
		Immutable 		= require('immutable'),
		Lazy            = require('lazyjs'),
		InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		noImage			= '/images/no-image.jpg';

const AlbumItem = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	onClickAlbum: function(e, album) {
		const self = this;

		if (self.isMounted()) {
			document.location.hash = 'albums/view/' + album.get('id');
			window.location.reload(true); //reload the page - all resources to be in place(prevents Bad Request)
		}

		e.stopPropagation();
	},
	onClickEditAlbum: function(e, album) {
		const self = this;

		if (self.isMounted()) {
			document.location.hash = 'albums/edit/' + album.get('id');
		}

		e.stopPropagation();
	},
	onClickDeleteAlbum: function(e, album) {
		const self = this,
			albumId = album.get('id'),
			binding = self.getDefaultBinding(),
			rootBinding = self.getMoreartyContext().getBinding(),
			eventId = rootBinding.get('routing.pathParameters.0');

		if(confirm("Delete this album?"))
			window.Server.album.delete(albumId).then(function() {
				window.Server.albumsByEvent.get(eventId)
					.then(function (res) {
						binding.set('albums', Immutable.fromJS(res));
				});
			});

		e.stopPropagation();
	},
	componentDidMount: function () {
	},
	render: function() {
		const self = this,
			binding = self.getDefaultBinding(),
			coverId = album.get('coverId'),
			photos = binding.toJS('albums.' + index + '.photos'),
			coverPhoto = coverId ? Lazy(photos).find(photo => photo.id === coverId) : photos[0],
			cover = coverPhoto ? coverPhoto.pic + '/contain?height=100': noImage,
			styles = {backgroundImage: 'url(' + cover + ')', width: self.state.albumWidth};

		return (
			<div onClick={function(e){self.onClickAlbum(e, album);}} key={'album-' + index} className='eEventAlbums_album' style={styles}>
				<span onClick={function(e){self.onClickEditAlbum(e, album);}} className='eEventAlbums_albumEdit'></span>
				<span onClick={function(e){self.onClickDeleteAlbum(e, album);}} className='eEventAlbums_albumDelete'></span>
				<span className='eEventAlbums_albumTitle'>{album.get('name')}</span>
			</div>
		);
	}
});


module.exports = AlbumItem;
