const 	AlbumEditForm 	= require('./album_edit_form'),
		Immutable		= require('immutable'),
		React			= require('react');

const AlbumEdit = React.createClass({
	mixins: [Morearty.Mixin],

	getInitialState: function() {
		return {
			albumData: null
		};
	},

	componentWillMount: function() {
		var self = this,
		rootBinding = self.getMoreartyContext().getBinding(),
		albumId = rootBinding.get('routing.pathParameters.1'),
		binding = self.getDefaultBinding();

		binding.clear();

		window.Server.album.get(albumId).then(function(data) {
			if (self.isMounted()) {
				binding.set(Immutable.fromJS(data));
			}
		});

		self.albumId = albumId;
	},

	onFormSubmit: function(data) {
		var self = this;

		window.Server.album.put(self.albumId, data).then(function() {
			if (self.isMounted()) {
				window.history.back();
			}
		});
	},

	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		return (
			<AlbumEditForm title='Edit album'
				onFormSubmit={self.onFormSubmit}
				albumId={self.albumId}
				binding={binding}
			/>
		);
	}
});

module.exports = AlbumEdit;
