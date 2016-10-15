const	React 				= require('react'),
		Morearty			= require('morearty'),

		Gallery				= require('./../../../../ui/new_gallery/galley');

const EventGallery = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		eventId:		React.PropTypes.string.isRequired
	},

	handleChangeAddPhotoButton: function(file) {
		this.getDefaultBinding().atomically()
			.set('isSync',		false)
			.set('isUploading',	true)
			.commit();

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
		}).then(() => this.getDefaultBinding().set('isUploading', false));
	},
	handleClickDeletePhoto: function(photoId) {
		this.getDefaultBinding().atomically()
			.set('isSync',		false)
			.set('isUploading',	true)
			.commit();

		return window.Server.schoolEventPhoto.delete(
			{
				schoolId:	this.props.activeSchoolId,
				eventId:	this.props.eventId,
				photoId:	photoId
			}
		).then(() => this.getDefaultBinding().set('isUploading', false));
	},

	render: function() {
		const	photos		= this.getDefaultBinding().toJS('photos'),
				isLoading	= !this.getDefaultBinding().toJS('isSync');

		console.log(isLoading);

		return (
			<div className='bEvent_media bEventBottomContainer'>
				<Gallery	isPublic					= { false }
							handleChangeAddPhotoButton	= { this.handleChangeAddPhotoButton }
							handleClickDeletePhoto		= { this.handleClickDeletePhoto }
							photos						= { photos }
							isLoading					= { isLoading }
				/>
			</div>
		);
	}
});


module.exports = EventGallery;
