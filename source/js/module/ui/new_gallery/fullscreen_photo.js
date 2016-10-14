const React = require('react');

const PreviewPhoto = React.createClass({
	propTypes: {
		id:					React.PropTypes.string.isRequired,
		url:				React.PropTypes.string.isRequired,
		handleClickPhoto:	React.PropTypes.func.isRequired,
		handleClickClose:	React.PropTypes.func.isRequired
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
		const	src			= this.props.url,//window.Server.images.getResizedToHeightUrl(this.props.photos[this.state.currentIndex].picUrl, 800),
				width		= window.innerWidth * 0.8,
				height		= this.state.windowHeight * 0.8,
				topOffset	= height * 0.5,
				leftOffset	= width * 0.5;

		const styles = {
			marginTop: -topOffset,
			marginLeft: -leftOffset,
			width: width,
			height: height,
			backgroundImage: 'url('+ src +')'
		};

		return (
			<div className='bAlbumFullscreenList'>
				<div className='bAlbumFullscreenWrapper'>
					<div	className	='eAlbumFullscreenList_image'
							style		={ styles }
							onClick		={ this.handleClickPhoto }
					>
						<div className='eAlbumFullscreenList_cross' onClick={this.props.handleClickClose}></div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = PreviewPhoto;
