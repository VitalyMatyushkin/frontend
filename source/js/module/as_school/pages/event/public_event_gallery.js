const	React					= require('react'),
		Morearty				= require('morearty'),

		Gallery					= require('./../../../ui/new_gallery/galley'),
		GalleryAccessPresets	= require('./../../../helpers/consts/gallery');

const PublicEventGallery = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		const photos = this.getDefaultBinding().toJS('photos');

		if(photos.length)
			// About props - isisUserCanUploadPhotos, it equals false because user can't upload photos in public mode.
			return(
				<div className="bEvent_media bEventBottomContainer">
					<Gallery	photos					= { photos }
								accessMode				= { GalleryAccessPresets.GALLERY_ACCESS_PRESET.PUBLIC }
								isUserCanUploadPhotos	= { false }
								isLoading				= { false }
					/>
				</div>
			);

		return null;
	}
});

module.exports = PublicEventGallery;

