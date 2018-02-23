import * as React from 'react';
import * as Morearty from 'morearty';
import * as MoreartyHelper from 'module/helpers/morearty_helper';
import * as GalleryAccessPresets from 'module/helpers/consts/gallery';
import {Gallery} from 'module/ui/new_gallery/gallery';
import {ActionsGallery} from './school_gallery_actions';

export const SchoolGallery = (React as any).createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		const   binding = this.getDefaultBinding();

		return (
			<Gallery
				mode='SCHOOL'
				currentUserId           = {MoreartyHelper.getLoggedInUserId(this)}
				accessMode              = {GalleryAccessPresets.GALLERY_ACCESS_PRESET.MANAGER}
				handleClickDeletePhoto  = {photoId => ActionsGallery.deletePhotoFromEvent(this.props.service, binding, this.props.albumId, photoId)}
				handleChangePicData     = {(photoId, model) => {ActionsGallery.changePicData(this.props.service, binding, this.props.albumId, photoId, model)}}
				handleChangeCover       = {picUrl => ActionsGallery.changeAlbumCover(this.props.service, this.props.albumId, picUrl)}
				photos                  = {binding.toJS('photos')}
				isLoading               = {!binding.get('isSync')}
				isUploadingPhoto        = {binding.get('isUploading')}
				isUserCanUploadPhotos   = {true}
			/>
		);
	}
});