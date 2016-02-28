const React = require('react');

const FullScreenList = React.createClass({
	getInitialState: function() {
		return {
			photos: 		[],
			currentIndex: 	0,
			windowWidth: 	window.innerWidth,
			windowHeight: 	window.innerHeight
		};
	},

	onImageLoad: function() {

	},

	onPhotoClick: function() {
		var self = this;
		var length = self.props.photos.length;
		this.setState({currentIndex: (self.state.currentIndex + 1) % length});
	},

	showNextPhoto: function() {

	},

	handleResize: function(e) {
		this.setState({
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight
		});
	},

	componentWillUnmount: function() {
		window.removeEventListener('resize', this.handleResize);
	},

	componentDidMount: function() {
		var self = this;
		this.setState({currentIndex: self.getStartIndex()});

		window.addEventListener('resize', this.handleResize);
	},

	getStartIndex: function() {
		var self = this;

		var photos = self.props.photos;
		var index = 0;
		for (var i = 0; i < photos.length; i++) {
			if (photos[i].id === self.props.startPhoto) {
				index = i;
				break;
			}
		}
		return index;
	},

	render: function() {
		var self = this;

		var src = self.props.photos[self.state.currentIndex].pic + '/contain?height=800';

		var width = this.state.windowWidth * 0.8;
		var height = this.state.windowHeight * 0.8;

		var topOffset = height * 0.5;
		var leftOffset = width * 0.5;

		var styles = {
			marginTop: -topOffset,
			marginLeft: -leftOffset,
			width: width,
			height: height,
			backgroundImage: 'url('+ src +')'
		};

		return (
			<div className='bAlbumFullscreenList'>
				<div className='bAlbumFullscreenWrapper'>
					<div className='eAlbumFullscreenList_image' style={styles} onClick={self.onPhotoClick}>
						<div className='eAlbumFullscreenList_cross' onClick={self.props.onClose}></div>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = FullScreenList;
