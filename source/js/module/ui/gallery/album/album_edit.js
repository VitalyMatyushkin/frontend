const 	AlbumEditForm 	= require('./album_edit_form'),
		Immutable		= require('immutable'),
		React			= require('react');

const AlbumEdit = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes:{
		service:React.PropTypes.object
	},
	getInitialState: function() {
		return {
			albumData: null
		};
	},

	componentWillMount: function() {
		const 	self 			= this,
				rootBinding 	= self.getMoreartyContext().getBinding(),
				binding 		= self.getDefaultBinding(),
				params      	= rootBinding.toJS('routing.pathParameters'),
				albumId 		= params && params.length ? params[params.length-1] : null;

		binding.clear();
		self.service = self.props.service;
		self.albumId = albumId;

		self.service.album.get(self.albumId).then(data => binding.set(Immutable.fromJS(data)));

	},

	onFormSubmit: function(data) {
		var self = this;

		self.service.album.put(self.albumId, data).then(res => window.history.back());
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
