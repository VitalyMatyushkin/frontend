const	React					= require('react'),
		AddPhotoButton			= require('./add_photo_button'),
		PreviewPhoto			= require('./preview_photo'),
		FullScreenPhoto			= require('./fullscreen_photo'),

		GalleryAccessPresets	= require('./../../helpers/consts/gallery');

const Gallery = React.createClass({
	MODE: {
		"PREVIEW_MODE":		"PREVIEW_MODE",
		"FULLSCREEN_MODE":	"FULLSCREEN_MODE"
	},

	propTypes: {
		photos:							React.PropTypes.array.isRequired,
		handleChangeAddPhotoButton:		React.PropTypes.func,
		handleChangeAccessPreset:		React.PropTypes.func,
		handleClickDeletePhoto:			React.PropTypes.func,
		accessMode:						React.PropTypes.string.isRequired,
		isLoading:						React.PropTypes.bool.isRequired
	},
	getInitialState: function() {
		return {
			mode:						this.MODE.PREVIEW_MODE,
			currentFullScreenPhotoId:	undefined
		};
	},

	componentWillMount: function() {},

	// preview photo
	handleClickPhoto: function(id) {
		this.setState({
			mode						: this.MODE.FULLSCREEN_MODE,
			currentFullScreenPhotoId	: id
		});
	},
	// preview fullscreen photo
	handleClickFullScreenPhoto: function(id) {

	},
	handleClickCloseFullScreenPhoto: function() {
		this.setState({
			mode						: this.MODE.PREVIEW_MODE,
			currentFullScreenPhotoId	: undefined
		});
	},
	handleChangeAccessPreset: function(id, preset) {
		this.props.handleChangeAccessPreset(id, preset);
	},

	renderPhotos: function() {
		const photos = this.props.photos.map( p => this.renderPhoto(p) );

		photos.push( this.renderAddPhotoButton() );	// TODO: actually you need a key for AddPhotoButton too

		return photos;
	},
	renderAddPhotoButton: function() {
		switch (this.props.accessMode) {
			case GalleryAccessPresets.GALLERY_ACCESS_PRESET.PUBLIC:
				return null;
			default:
				return (
					<AddPhotoButton	handleChange	= { this.props.handleChangeAddPhotoButton }
									isLoading		= { this.props.isLoading }
					/>
				);
		}
	},
	renderPhoto: function(photo) {
		return (
			<PreviewPhoto	key								= { photo.id }
							id								= { photo.id }
							url								= { photo.picUrl }
							accessMode						= { this.props.accessMode }
							handleClickPhoto				= { this.handleClickPhoto }
							handleClickDeletePhoto			= { this.props.handleClickDeletePhoto }
			/>
		);
	},
	renderFullScreenPhoto: function() {
		if(this.state.mode === this.MODE.FULLSCREEN_MODE) {
			const currentPhoto = this.props.photos.find(p => p.id === this.state.currentFullScreenPhotoId)

			return (
				<FullScreenPhoto	id							= { currentPhoto.id }
									url							= { currentPhoto.picUrl }
									handleClickPhoto			= { this.handleClickFullScreenPhoto }
									handleClickClose			= { this.handleClickCloseFullScreenPhoto }
									currentAccessPreset			= { currentPhoto.accessPreset }
									handleChangeAccessPreset	= { this.handleChangeAccessPreset.bind(this, currentPhoto.id)  }
									accessMode					= { this.props.accessMode }
				/>
			);
		} else {
			return null;
		}
	},
	render: function() {
		return (
			<div className="bGalleryWrapper">
				<div className="bGallery">
					{ this.renderPhotos() }
				</div>
				{ this.renderFullScreenPhoto() }
			</div>
		);
	}
});

module.exports = Gallery;
