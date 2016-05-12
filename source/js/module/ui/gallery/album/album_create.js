const 	AlbumEditForm 	= require('./album_edit_form'),
		React 			= require('react');

const AlbumCreate = React.createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function() {
		var self = this,
		binding = self.getDefaultBinding();

		binding.clear();
	},

	onFormSubmit: function(data) {
		var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            eventId = rootBinding.get('routing.pathParameters.1'),
            schoolId = rootBinding.get('userRules.activeSchoolId');

		window.Server.schoolEventAlbums.post({schoolId:schoolId, eventId:eventId}, {
			name: data.name,
			description: data.name,
			eventId: self.eventId,
			ownerId: data.ownerId
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
