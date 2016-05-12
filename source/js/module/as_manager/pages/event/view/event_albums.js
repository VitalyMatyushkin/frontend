const 	React 			= require('react'),
		Immutable 		= require('immutable'),
		Album			= require('module/ui/gallery/album/album_item');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
    },
	renderAlbum: function(album, index) {
		const self = this,
			binding = self.getDefaultBinding(),
			albumSub = binding.sub('albums.' + index);

		return (
			<Album binding={albumSub} key={album.id} onView={self.onClickAlbum} onEdit={self.onClickEditAlbum}
				   onDelete={self.onClickDeleteAlbum} />
		);
	},
	onClickAlbum: function(album) {
        document.location.hash = 'albums/view/' + album.id;
	},
	onClickEditAlbum: function(album) {
        document.location.hash = 'albums/edit/' + album.id;
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
	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		return (
			<div className='bEvent_media'>
				<div className='bEventAlbums_header'>
					<label className='eEventAlbums_title'>Media</label>
				</div>
				<div ref='albumsList' className='bEventAlbums'>
					{binding.get('albums').map(self.renderAlbum)}
					<div onClick={self.onClickCreateAlbum} key={'album-create'} className='eEventAlbums_album mCreate'>
						<span className='eEventAlbums_albumTitle'>Add...</span>
					</div>
				</div>
			</div>
		);
	}
});


module.exports = EventHeader;
