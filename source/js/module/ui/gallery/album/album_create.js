const 	AlbumEditForm 	= require('./album_edit_form'),
		Morearty        = require('morearty'),
		React 			= require('react');

const AlbumCreate = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes:{
		service:React.PropTypes.object
	},

	componentWillMount: function() {
		var self = this,
		binding = self.getDefaultBinding();

		binding.clear();
	},

	onFormSubmit: function(data) {
		var self = this;

		self.props.service.albums.post({
			name: data.name,
			description: data.name,
			ownerId: data.ownerId
		}).then(function() {
			window.history.back();
		});
	},

	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		return (
			<AlbumEditForm title='Create album'
				onFormSubmit={self.onFormSubmit}
				binding={binding}
			/>
		);
	}
});

module.exports = AlbumCreate;
