const 	React 				= require('react'),
		Immutable 			= require('immutable'),
		galleryServices     = require('module/as_manager/pages/event/gallery/eventGalleryServices'),
		Album				= require('module/ui/gallery/album/album_item');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			eventId = rootBinding.toJS('routing.pathParameters.0');

		self.service = galleryServices(binding, activeSchoolId, eventId);
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

        document.location.hash = 'albums/create/' + binding.get('model.id');

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
					<div onClick={self.onClickCreateAlbum} key={'album-create'} className='eAlbum mCreate'>
						<span className='eAlbumTitle'>Add...</span>
					</div>
				</div>
			</div>
		);
	}
});


module.exports = EventHeader;
