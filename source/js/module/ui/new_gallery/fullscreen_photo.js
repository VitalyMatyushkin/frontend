const	React				= require('react'),

		AccessPresetPanel		= require('./access_preset_panel'),
		AccessPresetsConsts		= require('./../../helpers/consts/event_photos'),
		GalleryAccessPresets	= require('./../../helpers/consts/gallery');

const FullscreenPhoto = React.createClass({
	propTypes: {
		id:							React.PropTypes.string.isRequired,
		url:						React.PropTypes.string.isRequired,
		isShowArrowButtons:			React.PropTypes.bool.isRequired,
		isShowSideContainer:		React.PropTypes.bool.isRequired,
		handleClickPrevPhoto:		React.PropTypes.func.isRequired,
		handleClickNextPhoto:		React.PropTypes.func.isRequired,
		handleClickClose:			React.PropTypes.func.isRequired,
		currentAccessPreset:		React.PropTypes.string.isRequired,
		handleChangeAccessPreset:	React.PropTypes.func.isRequired,
		accessMode:					React.PropTypes.string.isRequired
	},
	getInitialState: function() {
		return {
			windowWidth:	window.innerWidth,
			windowHeight:	window.innerHeight
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
					<AccessPresetPanel	currentAccessPreset	= { this.props.currentAccessPreset}
										accessPresetList	= { AccessPresetsConsts.ACCESS_PRESET_LIST_MANAGER }
										handleChange		= { this.props.handleChangeAccessPreset }
					/>
				);
			case GalleryAccessPresets.GALLERY_ACCESS_PRESET.PARENT:
				return (
					<AccessPresetPanel	currentAccessPreset	= { this.props.currentAccessPreset}
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
	renderSideContainer: function(sideContainerStyle) {
		if(this.props.isShowSideContainer) {
			return (
				<div	className	= 'eFullScreenPhoto_sideContainer'
						style		= { sideContainerStyle }
				>
					{ this.renderAccessPanelMode() }
				</div>
			);
		} else {
			return null;
		}
	},
	render: function() {
		const	src			= window.Server.images.getResizedToHeightUrl(this.props.url, 800),
				width		= this.state.windowWidth * 0.8,
				height		= this.state.windowHeight * 0.8,
				topOffset	= height * 0.5,
				leftOffset	= width * 0.5;

		const photoContainerStyle	= {
			marginTop:			-topOffset,
			marginLeft:			-leftOffset,
			width:				width,
			height:				height
		},
		photoStyle = {
			height:				height,
			backgroundImage:	`url(${src})`
		},
		sideContainerStyle = {
			height: height - 10 // 10px - it is a left padding
		},
		arrowStyle = {
			height: height
		};

		return (
			<div	className	= 'bFullScreenPhoto'
					onClick		= { this.handleClickClose }
			>
				<div	className	= 'eAlbumFullscreenList_cross'
						onClick		= { this.handleClickClose }
				>
				</div>
				<div	className	= "eFullScreenPhoto_photoContainer"
						onClick		= { this.handleClickPhoto }
						style		= { photoContainerStyle }
				>
					{ this.renderPhoto(photoStyle, arrowStyle) }
					{ this.renderSideContainer(sideContainerStyle) }
				</div>
			</div>
		);
	}
});

module.exports = FullscreenPhoto;
