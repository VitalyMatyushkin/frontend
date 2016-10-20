const	React				= require('react'),

		If					= require('./../if/if'),
		AccessPresetPanel	= require('./access_preset_panel');

const PreviewPhoto = React.createClass({
	propTypes: {
		id:							React.PropTypes.string.isRequired,
		url:						React.PropTypes.string.isRequired,
		handleClickPhoto:			React.PropTypes.func.isRequired,
		handleClickClose:			React.PropTypes.func.isRequired,
		currentAccessPreset:		React.PropTypes.string.isRequired,
		handleChangeAccessPreset:	React.PropTypes.func.isRequired,
		isPublic:					React.PropTypes.bool.isRequired
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
	handleClickPhoto: function() {
		this.props.handleClickPhoto(this.props.id)
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
		};
		console.log(this.props.isPublic);
		return (
			<div className='bFullScreenPhoto'>
				<div	className	= 'eAlbumFullscreenList_cross'
						onClick		= {this.props.handleClickClose}
				>
				</div>
				<div	className	= "eFullScreenPhoto_photoContainer"
						style		= { photoContainerStyle }
						onClick		= { this.handleClickPhoto }
				>
					<div	className	= 'eFullScreenPhoto_photo'
							style		= { photoStyle }
					>
					</div>
						<div	className	= 'eFullScreenPhoto_sideContainer'
								style		= { sideContainerStyle }
						>
							<If condition={!this.props.isPublic}>
								<AccessPresetPanel	currentAccessPreset	= { this.props.currentAccessPreset}
													handleChange		= { this.props.handleChangeAccessPreset }
								/>
							</If>
						</div>
				</div>
			</div>
		);
	}
});

module.exports = PreviewPhoto;
