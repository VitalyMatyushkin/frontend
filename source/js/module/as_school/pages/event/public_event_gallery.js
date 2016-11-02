const	React					= require('react'),
		Morearty				= require('morearty'),

		Gallery					= require('./../../../ui/new_gallery/galley'),
		GalleryAccessPresets	= require('./../../../helpers/consts/gallery');

const PublicEventGallery = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		const photos = this.getDefaultBinding().toJS('photos');

		return(
			<div className="bEvent_media bEventBottomContainer">
				<Gallery	photos			= { photos }
							accessMode		= { GalleryAccessPresets.GALLERY_ACCESS_PRESET.PUBLIC }
							isLoading		= { false }
				/>
			</div>
		);
	}
});

module.exports = PublicEventGallery;

