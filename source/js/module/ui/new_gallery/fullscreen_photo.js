const	React				= require('react'),

		AccessPresetPanel		= require('./access_preset_panel'),
		AccessPresetsConsts		= require('./../../helpers/consts/event_photos'),
		GalleryAccessPresets	= require('./../../helpers/consts/gallery'),
		BPromise	            = require('bluebird'),
		CropImageHelper         = require('module/helpers/crop_image_helper'),
		{rotateImage}           = require('module/ui/gallery/rotateModel'),
		{PhotoEditComponent}    = require('module/ui/gallery/photo/photo_edit'),
		{SVG}                   = require('module/ui/svg'),
		Loader                  = require('module/ui/loader'),
		{AnonymousIcon}         = require('module/ui/gallery/anonymous_icon/anonymous_icon');

const ANGLE = {
	LEFT: -Math.PI/2,
	RIGHT: Math.PI/2
};

const FullscreenPhoto = React.createClass({
	propTypes: {
		photoData:					React.PropTypes.object.isRequired,
		albumId:					React.PropTypes.string,
		isShowArrowButtons:			React.PropTypes.bool.isRequired,
		isShowSideContainer:		React.PropTypes.bool.isRequired,
		handleClickPrevPhoto:		React.PropTypes.func.isRequired,
		handleClickNextPhoto:		React.PropTypes.func.isRequired,
		handleClickClose:			React.PropTypes.func.isRequired,
		handleChangeAccessPreset:	React.PropTypes.func.isRequired,
		handleChangePicData:	    React.PropTypes.func.isRequired,
		handleClickDeletePhoto:	    React.PropTypes.func.isRequired,
		accessMode:					React.PropTypes.string.isRequired
	},
	getInitialState: function() {
		return {
			windowWidth:	window.innerWidth,
			windowHeight:	window.innerHeight,
			addIconMode:    false,
			isLoad:         false
		};
	},
	componentDidMount: function() {
		window.addEventListener('resize', this.handleResize);
	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.handleResize);
	},
	handleResize: function() {
		this.setState({
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight
		});
	},
	handleClickClose: function(e) {
		this.props.handleClickClose();
		e.stopPropagation();
	},
	handleClickPrevPhoto: function(e) {
		this.props.handleClickPrevPhoto();
		e.stopPropagation();
	},
	handleClickNextPhoto: function(e) {
		this.props.handleClickNextPhoto();
		e.stopPropagation();
	},
	handleClickPhoto: function(e) {
		e.stopPropagation();
	},
	renderAccessPanelMode: function() {
		switch (this.props.accessMode) {
			case GalleryAccessPresets.GALLERY_ACCESS_PRESET.MANAGER:
				return (
					<AccessPresetPanel	currentAccessPreset	= { this.props.photoData.accessPreset}
										accessPresetList	= { AccessPresetsConsts.ACCESS_PRESET_LIST_MANAGER }
										handleChange		= { this.props.handleChangeAccessPreset }
					/>
				);
			case GalleryAccessPresets.GALLERY_ACCESS_PRESET.PARENT:
				return (
					<AccessPresetPanel	currentAccessPreset	= { this.props.photoData.accessPreset}
										accessPresetList	= { AccessPresetsConsts.ACCESS_PRESET_LIST_PARENT }
										handleChange		= { this.props.handleChangeAccessPreset }
					/>
				);
			case GalleryAccessPresets.GALLERY_ACCESS_PRESET.PUBLIC:
				return null;
		}
	},
	renderPhoto: function(photoStyle, arrowStyle) {
		if(this.props.isShowArrowButtons) {
			return (
				<div	className	= 'eFullScreenPhoto_photo'
						style		= { photoStyle }
				>
					<div	className	= "eFullScreenPhoto_arrowLeft"
							onClick		= { this.handleClickPrevPhoto }
							style		= { arrowStyle }
					>
					</div>
					<div	className	= "eFullScreenPhoto_arrowRight"
							onClick		= { this.handleClickNextPhoto }
							style		= { arrowStyle }
					>
					</div>
					{this.state.isLoad ? <Loader/> : null}
				</div>
			);
		} else {
			return (
				<div	className	= 'eFullScreenPhoto_photo'
						style		= { photoStyle }
				>
				</div>
			);
		}
	},
	renderEditPhotoPanel: function () {
		return (
			<div className="bEditPhotoPanel">
				<span onClick={() => this.setState({addIconMode: true, isLoad: true})} className="bTooltip" id="addIcon_button" data-description="Add anonymous icon"><SVG icon="icon_anonymous_icon"/></span>
				<span onClick={e => this.onRotatePhoto(e, ANGLE.LEFT)} className="bTooltip" id="albumLeftRotate_button" data-description="Rotate photo to left"><SVG icon="icon_rotate_left"/></span>
				<span onClick={e => this.onRotatePhoto(e, ANGLE.RIGHT)} className="bTooltip" id="albumLeftRotate_button" data-description="Rotate photo to right"><SVG icon="icon_rotate_right"/></span>
				<span onClick={e => this.handleClickDeletePhoto(e)} className="bTooltip" id="albumCover_button" data-description="Delete photo"><SVG icon="icon_trash_photo"/></span>
			</div>
		);
	},
	renderSideContainer: function(sideContainerStyle) {
		if(this.props.isShowSideContainer) {
			return (
				<div	className	= 'eFullScreenPhoto_sideContainer'
						style		= { sideContainerStyle }
				>
					{ this.renderEditPhotoPanel()}
					{ this.props.mode === 'EVENT' ? this.renderAccessPanelMode() : null }
					{ this.props.mode === 'SCHOOL' ?
						<PhotoEditComponent
							key={this.props.photoData.id}
							albumId={this.props.albumId}
							photoData={this.props.photoData}
							onSubmit={this.props.handleChangePicData}
						/> : null }
				</div>
			);
		} else {
			return null;
		}
	},
	handleSaveClick(file) {
		window.Server.images.upload(file)
			.then( picUrl => {
				return this.props.handleChangePicData({picUrl})
			})
			.then(() => this.setState({addIconMode: false, isLoad: false}));
	},
	handleClickDeletePhoto(e) {
		this.setState({isLoad: true});
		window.simpleAlert(
			'The photo will be deleted! Are you sure?',
			'Ok',
			() => {
				this.props.handleClickDeletePhoto()
				.then(() => {
					this.setState({isLoad: false});
					this.props.handleClickClose();
				});
			}
		);
		e.stopPropagation();
	},
	onRotatePhoto(e, angle) {
		window.confirmAlert(
			"The photo will be rotated.",
			"Ok",
			"Cancel",
			() =>
				this.rotatePhoto(angle)
		);
		e.stopPropagation();
	},
	rotatePhoto(angle) {
		this.setState({isLoad: true});
		return rotateImage(this.props.photoData.picUrl, angle)
			.then((data) => {
				const file = CropImageHelper.dataURLtoFile(data);
				window.Server.images.upload(file)
					.then( picUrl => {
						return this.props.handleChangePicData({picUrl})
					})
					.then(() => this.setState({isLoad: false}))
			});
	},
	render: function() {
			const   src = this.props.photoData.picUrl,
					width = Math.floor(this.state.windowWidth * 0.8),
					height = Math.floor(this.state.windowHeight * 0.8),
					topOffset = height * 0.5,
					leftOffset = width * 0.5;

			const photoContainerStyle = {
					marginTop: -topOffset,
					marginLeft: -leftOffset,
					width: width,
					height: height
				},
				photoStyle = {
					height: height,
					backgroundImage: `url(${src})`
				},
				sideContainerStyle = {
					height: height - 10 // 10px - it is a left padding
				},
				arrowStyle = {
					height: height
				};
		if (!this.state.addIconMode) {
			return (
				<div className='bFullScreenPhoto'
				     onClick={this.handleClickClose}
				>
					<div className='eAlbumFullscreenList_cross'
					     onClick={this.handleClickClose}
					>
					</div>
					<div className="eFullScreenPhoto_photoContainer"
					     onClick={this.handleClickPhoto}
					     style={photoContainerStyle}
					>
						{this.renderPhoto(photoStyle, arrowStyle)}
						{this.renderSideContainer(sideContainerStyle)}
					</div>
				</div>
			);
		} else {
			return (
				<div className='bFullScreenPhoto'>
					<AnonymousIcon
						handleSaveClick     = {(file) => this.handleSaveClick(file)}
						handleCancelClick   = {() => this.setState({addIconMode: false, isLoad: false})}
						getUrlPhoto         = {() => BPromise.resolve(this.props.photoData.picUrl)}
						photoContainerStyle = {photoContainerStyle}
						widthImgContainer   = {width-280}
						heightImgContainer  = {height}
					/>
				</div>
			);
		}
	}
});

module.exports = FullscreenPhoto;
