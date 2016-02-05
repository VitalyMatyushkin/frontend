const 	React 			= require('react'),
		Immutable 		= require('immutable'),
		ReactDOM		= require('reactDom'),
		Lazy            = require('lazyjs'),
		InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		Album			= require('module/ui/gallery/album_item');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	renderAlbum: function(album, index) {
		const self = this,
			binding = self.getDefaultBinding(),
			albumSub = binding.sub('album' + index);

		albumSub.set(album);
			//coverId = album.get('coverId'),
			//photos = binding.toJS('albums.' + index + '.photos'),
			//coverPhoto = coverId ? Lazy(photos).find(photo => photo.id === coverId) : photos[0],
			//cover = coverPhoto ? coverPhoto.pic + '/contain?height=100': noImage,
			//styles = {backgroundImage: 'url(' + cover + ')', width: self.state.albumWidth};

		//return (
		//	<div onClick={function(e){self.onClickAlbum(e, album);}} key={'album-' + index} className='eEventAlbums_album' style={styles}>
		//		<span onClick={function(e){self.onClickEditAlbum(e, album);}} className='eEventAlbums_albumEdit'></span>
		//		<span onClick={function(e){self.onClickDeleteAlbum(e, album);}} className='eEventAlbums_albumDelete'></span>
		//		<span className='eEventAlbums_albumTitle'>{album.get('name')}</span>
		//	</div>
		//);

		return (
			<Album binding={albumSub} key={album.id} onView={self.onClickAlbum} onEdit={self.onClickEditAlbum}
				   onDelete={self.onClickDeleteAlbum} />
		);
	},
	onClickAlbum: function(album) {
		const self = this;

		if (self.isMounted()) {
			document.location.hash = 'albums/view/' + album.id;
			window.location.reload(true); //reload the page - all resources to be in place(prevents Bad Request)
		}
	},
	onClickEditAlbum: function(album) {
		const self = this;

		if (self.isMounted()) {
			document.location.hash = 'albums/edit/' + album.id;
		}
	},
	onClickDeleteAlbum: function(album) {
		const self = this,
			binding = self.getDefaultBinding(),
			rootBinding = self.getMoreartyContext().getBinding(),
			eventId = rootBinding.get('routing.pathParameters.0');

		window.Server.album.delete(album.id).then(function() {
			window.Server.albumsByEvent.get(eventId)
				.then(function (res) {
					binding.set('albums', Immutable.fromJS(res));
			});
		});
	},
	onClickCreateAlbum: function(e) {
		var self = this,
			binding = self.getDefaultBinding();

		if (self.isMounted()) {
			document.location.hash = 'albums/create/' + binding.get('model.id');
		}

		e.stopPropagation();

	},
	componentDidMount: function () {
		//var width = ReactDOM.findDOMNode(this.refs.albumsList).offsetWidth;
		//this.setState({albumWidth: width / 6 - 7});
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
					<div onClick={self.onClickCreateAlbum} key={'album-create'} className='eEventAlbums_album mCreate' style={{width: '100px'}}>
						<span className='eEventAlbums_albumTitle'>Add...</span>
					</div>
				</div>
			</div>
		);
	}
});


module.exports = EventHeader;
