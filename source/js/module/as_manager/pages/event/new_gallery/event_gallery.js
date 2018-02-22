const	React 					= require('react'),
		Morearty				= require('morearty'),
		Actions					= require('./event_gallery_actions'),
		RoleHelper				= require('./../../../../helpers/role_helper'),

		GalleryAccessPresets	= require('./../../../../helpers/consts/gallery'),
		MoreartyHelper			= require('./../../../../helpers/morearty_helper');

import {Gallery} from './../../../../ui/new_gallery/gallery';

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
			case "STUDENT":
				return GalleryAccessPresets.GALLERY_ACCESS_PRESET.STUDENT;
			default:
				return GalleryAccessPresets.GALLERY_ACCESS_PRESET.MANAGER;
		}
	},
	render: function() {
		const	binding					= this.getDefaultBinding(),
				photos					= binding.toJS('photos'),
				isLoading				= !binding.toJS('isSync'),
				isUploadingPhoto 		= binding.toJS('isUploading'),
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
							handleChangePicUrl         	= { (photoId, picUrl) => Actions.changePhotoUrl(userRole, binding, schoolId, eventId, photoId, picUrl) }
							photos						= { photos }
							isLoading					= { isLoading }
							isUploadingPhoto 			= { isUploadingPhoto }
							isUserCanUploadPhotos		= { isUserCanUploadPhotos }
				/>
			</div>
		);
	}
});


module.exports = EventGallery;
