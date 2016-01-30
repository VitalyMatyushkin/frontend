const 	React 			= require('react'),
		Immutable 		= require('immutable'),
		Lazy            = require('lazyjs'),
		InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		noImage			= '/images/no-image.jpg';

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	renderAlbum: function(album, index) {
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
	},
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
	onClickCreateAlbum: function(e) {
		var self = this,
			binding = self.getDefaultBinding();

		if (self.isMounted()) {
			document.location.hash = 'albums/create/' + binding.get('model.id');
		}

		e.stopPropagation();

	},
	getInitialState: function() {
		return {
			isAlbumEditing: false,
			albumsListWidth: '120'
		};
	},
	componentDidMount: function () {
		var width = this.refs.albumsList.getDOMNode().offsetWidth;
		this.setState({albumWidth: width / 6 - 7});
	},
	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		return (
			<div>
				<div className='bEventAlbums_header'>
					<label className='eEventAlbums_title'>Albums</label>
				</div>
				<div ref='albumsList' className='bEventAlbums'>
					{binding.get('albums').map(self.renderAlbum)}
					<div onClick={self.onClickCreateAlbum} key={'album-create'} className='eEventAlbums_album mCreate' style={{width: self.state.albumWidth}}>
						<span className='eEventAlbums_albumTitle'>Add...</span>
					</div>
				</div>
			</div>
		);
	}
});


module.exports = EventHeader;
