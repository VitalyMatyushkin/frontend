const 	React 			= require('react'),
		Immutable 		= require('immutable'),
		Lazy            = require('lazyjs'),
		InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	renderAlbum: function(album, index) {
		const self = this,
			binding = self.getDefaultBinding(),
			coverId = album.get('coverId');
		let cover = Lazy(binding.toJS('albums.' + index + '.photos')).find(photo => photo.id === coverId);
		cover = cover ? cover.pic + '/contain?height=100': '/images/no-image.jpg';

		const styles = {backgroundImage: 'url(' + cover + ')', width: self.state.albumWidth};

		return (
			<div onClick={self.onClickAlbum.bind(self, album)} key={'album-' + index} className='eEventAlbums_album' style={styles}>
				<span onClick={self.onClickEditAlbum.bind(self, album)} className='eEventAlbums_albumEdit'></span>
				<span onClick={self.onClickDeleteAlbum.bind(self, album)} className='eEventAlbums_albumDelete'></span>
				<span className='eEventAlbums_albumTitle'>{album.get('name')}</span>
			</div>
		);
	},
	onClickAlbum: function(album) {
		const self = this;

		if (self.isMounted()) {
			document.location.hash = 'albums/view/' + album.get('id');
			window.location.reload(true); //reload the page - all resources to be in place(prevents Bad Request)
		}

		return false;
	},
	onClickEditAlbum: function(album) {
		const self = this;

		if (self.isMounted()) {
			document.location.hash = 'albums/edit/' + album.get('id');
		}

		return false;
	},
	onClickDeleteAlbum: function(album) {
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

		return false;
	},
	onClickCreateAlbum: function() {
		var self = this,
			binding = self.getDefaultBinding();

		if (self.isMounted()) {
			document.location.hash = 'albums/create/' + binding.get('model.id');
		}

		return false;

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
