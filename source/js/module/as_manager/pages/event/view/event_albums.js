var If = require('module/ui/if/if'),
		InvitesMixin = require('module/as_manager/pages/invites/mixins/invites_mixin'),
		RouterView = require('module/core/router'),
		Route = require('module/core/route');

var EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	renderAlbum: function(album, index) {
		var self = this,
		binding = self.getDefaultBinding(),
		cover = binding.get('albums.' + index + '.photos.0.pic') + '/contain?height=100',
		styles = {backgroundImage: 'url(' + cover + ')', width: self.state.albumWidth};

		return (
			<div onClick={self.onClickAlbum.bind(self, album)} key={'album-' + index} className='eEventAlbums_album' style={styles}>
				<span onClick={self.onClickEditAlbum.bind(self, album)} className='eEventAlbums_albumEdit'></span>
				<span className='eEventAlbums_albumTitle'>{album.get('name')}</span>
			</div>
		);
	},
	onClickAlbum: function(album) {
		var self = this;

		if (self.isMounted()) {
			document.location.hash = 'albums/view/' + album.get('id');
		}

		return false;
	},
	onClickEditAlbum: function(album) {
		var self = this;

		if (self.isMounted()) {
			document.location.hash = 'albums/edit/' + album.get('id');
		}

		return false;
	},
	onClickCreateAlbum: function() {
		var self = this,
			binding = self.getDefaultBinding();

		if (self.isMounted()) {
			document.location.hash = 'albums/create/' + binding.get('model.id');
		}

		return false;


		//var self = this,
		//	binding = self.getDefaultBinding(),
		//	rootBinding = self.getMoreartyContext().getBinding(),
		//	userId = rootBinding.get('userData.authorizationInfo.userId');
        //
		//window.Server.albumsByEvent.post(binding.get('model.id'), {
		//	name: binding.get('model.name') + ' - ' + binding.get('sport.name'),
		//	description: binding.get('model.name'),
		//	eventId: binding.get('model.id'),
		//	ownerId: userId
		//}).then(function(res) {
		//	self.isMounted() && (document.location.hash = 'albums/view/' + res.id);
		//});
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
