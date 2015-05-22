var If = require('module/ui/if/if'),
	InvitesMixin = require('module/as_manager/pages/invites/mixins/invites_mixin'),
	EventHeader;

EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	renderAlbum: function(album, index) {
		var self = this,
			binding = self.getDefaultBinding(),
			cover = binding.get('albums.' + index + '.photos.0.pic'),
			styles = {backgroundImage: 'url(' + cover + ')'};

		return <div onClick={self.onClickAlbum.bind(null, album)} key={'album-' + index} className="eEventAlbums_album" style={styles}>
			<span className="eEventAlbums_albumTitle">{album.get('name')}</span>
		</div>;
	},
	onClickAlbum: function(album) {
		var self = this;

		self.isMounted() && (document.location.hash = 'albums/' + album.get('id'));
	},
	render: function() {
        var self = this,
			binding = self.getDefaultBinding();


		return <div className="bEventAlbums">{binding.get('albums').map(self.renderAlbum.bind(self))}</div>;
	}
});


module.exports = EventHeader;
