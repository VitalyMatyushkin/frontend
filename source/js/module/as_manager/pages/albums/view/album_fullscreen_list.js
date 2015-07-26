var FullScreenList = React.createClass({

	getInitialState: function() {
		return {
			photos: [],
			currentIndex: 0
		};
	},

	onImageLoad: function() {

	},

	onPhotoClick: function() {
		var self = this;
		var length = self.props.photos.length;
		this.setState({currentIndex: (self.state.currentIndex + 1) % length});
	},

	showNextPhoto() {

	},

	componentDidMount: function() {
		var self = this;
		this.setState({currentIndex: self.getStartIndex()});
	},

	getStartIndex() {
		var self = this;

		var photos = self.props.photos;
		var index = 0;
		for (var i = 0; i < photos.length; i++) {
			if (photos[i].id === self.props.startPhoto) {
				index = i;
			}
		}
		return index;
	},

	render: function() {
		var self = this;

		var imgClasses = 'bAlbumFullscreenList';

		var src = self.props.photos[self.state.currentIndex].pic + '/contain?height=600';

		var styles = {background: 'url(' + src + ')' + ' no-repeat center'};
		return (
			<div className={imgClasses}>
				<div className='Cross' onClick={self.props.onClose}></div>
				<div className='bAlbumFullscreenWrapper' style={styles} onClick={self.onPhotoClick}>
				</div>
			</div>
		);
	}

});

module.exports = FullScreenList;
