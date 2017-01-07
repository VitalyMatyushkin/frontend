const	React 					= require('react'),
		Morearty				= require('morearty'),
		Actions					= require('./event_gallery_actions'),
		Gallery					= require('./../../../../ui/new_gallery/galley'),
		RoleHelper				= require('./../../../../helpers/role_helper'),

		GalleryAccessPresets	= require('./../../../../helpers/consts/gallery'),
		MoreartyHelper			= require('./../../../../helpers/morearty_helper');

const EventGallery = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		eventId:		React.PropTypes.string.isRequired
	},

	getGalleryAccessPreset: function(userRole) {
		switch (userRole) {
			case "PARENT":
				return GalleryAccessPresets.GALLERY_ACCESS_PRESET.PARENT;
			default:
				return GalleryAccessPresets.GALLERY_ACCESS_PRESET.MANAGER;
		}
	},
	render: function() {
		const	binding					= this.getDefaultBinding(),
				photos					= binding.toJS('photos'),
				isLoading				= !binding.toJS('isSync'),
				isUserCanUploadPhotos	= binding.toJS('isUserCanUploadPhotos'),
				schoolId				= this.props.activeSchoolId,
				eventId					= this.props.eventId,
				userRole				= RoleHelper.getLoggedInUserRole(this);

		return (
			<div className='bEvent_media bEventBottomContainer'>
				<Gallery	currentUserId				= { MoreartyHelper.getLoggedInUserId(this) }
							accessMode					= { this.getGalleryAccessPreset(userRole) }
							handleClickDeletePhoto		= { photoId => Actions.deletePhotoFromEvent(userRole, binding, schoolId, eventId, photoId) }
							handleChangeAccessPreset	= { (photoId, preset) => Actions.changePhotoPreset(userRole, binding, schoolId, eventId, photoId, preset) }
							photos						= { photos }
							isLoading					= { isLoading }
							isUserCanUploadPhotos		= { isUserCanUploadPhotos }
				/>
			</div>
		);
	}
});


module.exports = EventGallery;
