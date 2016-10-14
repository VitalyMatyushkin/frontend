const	React 				= require('react'),
		Morearty			= require('morearty'),
		Immutable 			= require('immutable'),

		Gallery				= require('./../../../../ui/new_gallery/galley');

const EventGallery = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		eventId:		React.PropTypes.string.isRequired
	},

	handleChangeAddPhotoButton: function(file) {
		window.Server.images.upload(file).then(picUrl => {
			return window.Server.schoolEventPhotos.post(
				{
					schoolId:	this.props.activeSchoolId,
					eventId:	this.props.eventId
				},
				{
					picUrl: picUrl
				}
			)
		}).then(() => this.getDefaultBinding().set('isSync', false));
	},

	render: function() {
		const photos = this.getDefaultBinding().toJS('photos');

		return (
			<div className='bEvent_media bEventBottomContainer'>
				<Gallery	photos						= { photos }
							handleChangeAddPhotoButton	= { this.handleChangeAddPhotoButton }
				/>
			</div>
		);
	}
});


module.exports = EventGallery;
