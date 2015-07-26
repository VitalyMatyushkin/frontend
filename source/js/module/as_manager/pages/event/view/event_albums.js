var If = require('module/ui/if/if'),
		InvitesMixin = require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventHeader;

EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	renderAlbum: function(album, index) {
		var self = this,
				binding = self.getDefaultBinding(),
				cover = binding.get('albums.' + index + '.photos.0.pic') + '/contain?height=100',
				styles = {backgroundImage: 'url(' + cover + ')'};

		return <div onClick={self.onClickAlbum.bind(null, album)} key={'album-' + index} className='eEventAlbums_album' style={styles}>
						<span className='eEventAlbums_albumTitle'>{album.get('name')}</span>
					</div>;
	},
	onClickAlbum: function(album) {
		var self = this;

		self.isMounted() && (document.location.hash = 'albums/' + album.get('id'));
	},
	onClickCreateAlbum: function() {
		var self = this,
			binding = self.getDefaultBinding();

		window.Server.albumsByEvent.post(binding.get('model.id'), {
			name: binding.get('model.name') + ' - ' + binding.get('sport.name'),
			description: binding.get('model.name'),
			eventId: binding.get('model.id')
		}).then(function(res) {
			self.isMounted() && (document.location.hash = 'albums/' + res.id);
		});
	},
	render: function() {
		var self = this,
				binding = self.getDefaultBinding();

		return (
			<div>
				<div className='bEventAlbums_header'>
					<label className='title'>Albums</label>
					<label className='action'>Add album</label>
				</div>
				<div className='bEventAlbums'>
					{binding.get('albums').map(self.renderAlbum.bind(self))}
					<div onClick={self.onClickCreateAlbum} key={'album-create'} className='eEventAlbums_album mCreate'>
						<span className='eEventAlbums_albumTitle'>Add...</span>
					</div>
				</div>
			</div>
		);
	}
});


module.exports = EventHeader;
