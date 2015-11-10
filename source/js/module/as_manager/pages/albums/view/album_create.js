var AlbumEditForm = require('./album_edit_form');

var AlbumCreate = React.createClass({
	mixins: [Morearty.Mixin],

	getInitialState: function() {
		return {
			albumData: null
		};
	},

	componentWillMount: function() {
		var self = this,
		rootBinding = self.getMoreartyContext().getBinding(),
		eventId = rootBinding.get('routing.pathParameters.1'),
		binding = self.getDefaultBinding();

		binding.clear();

		self.eventId = eventId;
	},

	onFormSubmit: function(data) {
		var self = this;

		window.Server.albumsByEvent.post(self.eventId, {
			name: data.name,
			description: data.name,
			eventId: self.eventId,
			ownerId: data.ownerId,
		}).then(function() {
			self.isMounted() && window.history.back();
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
