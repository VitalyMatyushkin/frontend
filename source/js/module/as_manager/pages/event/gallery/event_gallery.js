const 	React 				= require('react'),
		Immutable 			= require('immutable'),
		galleryServices     = require('module/as_manager/pages/event/gallery/eventGalleryServices'),
		Morearty			= require('morearty'),
		Album				= require('module/ui/gallery/album/album_item');

const EventGallery = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			eventId = binding.get('model.id');

		self.service = galleryServices(binding, activeSchoolId, eventId);
		self.basePath = `event-albums/${eventId}`;
		self.service.albums.get().then(res => binding.set('albums', Immutable.fromJS(res)));
    },
	renderAlbum: function(album, index) {
		const self = this,
			binding = self.getDefaultBinding(),
			albumSub = binding.sub('albums.' + index);

		return (
			<Album binding={albumSub} key={album.id} basePath={self.basePath}
				   onDelete={self.onClickDeleteAlbum} />
		);
	},
	onClickDeleteAlbum: function(album) {
		const self = this,
			binding = self.getDefaultBinding();

		self.service.album.delete(album.id).then(function() {
			self.service.albums.get().then(res => binding.set('albums', Immutable.fromJS(res)));
		});
	},
	onClickCreateAlbum: function(e) {
		var self = this;

        document.location.hash = self.basePath + '/create';

		e.stopPropagation();
	},
	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		return (
			<div className='bEvent_media bEventBottomContainer'>
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


module.exports = EventGallery;
