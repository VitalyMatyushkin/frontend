const	React				= require('react'),

		AccessPresetPanel		= require('./access_preset_panel'),
		AccessPresetsConsts		= require('./../../helpers/consts/event_photos'),
		GalleryAccessPresets	= require('./../../helpers/consts/gallery'),
		BPromise	            = require('bluebird'),
		{AnonymousIcon}         = require('module/ui/gallery/anonymous_icon/anonymous_icon');

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
		handleChangePicUrl:	        React.PropTypes.func.isRequired,
		accessMode:					React.PropTypes.string.isRequired
	},
	getInitialState: function() {
		return {
			windowWidth:	window.innerWidth,
			windowHeight:	window.innerHeight,
			addIconMode:    false
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
	renderAddAnonymousIconButton: function () {
		return <button className="bButton" onClick={() => this.setState({addIconMode: true})}>Add anonymous icon</button>;
	},
	renderSideContainer: function(sideContainerStyle) {
		if(this.props.isShowSideContainer) {
			return (
				<div	className	= 'eFullScreenPhoto_sideContainer'
						style		= { sideContainerStyle }
				>
					{ this.renderAccessPanelMode() }
					{ this.renderAddAnonymousIconButton()}
				</div>
			);
		} else {
			return null;
		}
	},
	getUrlPhoto() {
		return BPromise.resolve(this.props.url);
	},
	handleSaveClick(file) {
		window.Server.images.upload(file)
			.then( picUrl => {
				return this.props.handleChangePicUrl(picUrl)
			})
			.then(() => this.setState({addIconMode: false}));
	},
	render: function() {
			const src = window.Server.images.getResizedToHeightUrl(this.props.url, 800),
				width = this.state.windowWidth * 0.8,
				height = this.state.windowHeight * 0.8,
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
					<div className="eFullScreenPhoto_photoContainer"
					     style={photoContainerStyle}
					>
						<AnonymousIcon
							handleSaveClick     = {(file) => this.handleSaveClick(file)}
							handleCancelClick   = {() => this.setState({addIconMode: false})}
							getUrlPhoto         = {this.getUrlPhoto}
							widthImgContainer   = {width}
							heightImgContainer  = {height-135}
						/>
					</div>
				</div>
			);
		}
	}
});

module.exports = FullscreenPhoto;
