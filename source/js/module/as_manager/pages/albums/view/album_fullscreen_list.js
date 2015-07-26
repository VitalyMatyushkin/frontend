var FullScreenList = React.createClass({

	getInitialState: function() {
		return {
			photos: [],
			currentIndex: 0
		};
	},

	onImageLoad: function() {

	},

	onImageClick: function() {
		var self = this;

	},

	componentDidMount: function() {
		this.setState({currentIndex: this.props.startPhoto});
	},

	render: function() {
		var self = this;

		var imgClasses = 'bAlbumFullscreenList';

		var src = self.props.photos.filter(function(photo) {
			return photo.id === self.state.currentIndex;
		});



		if (src.length > 0) {
			src = (src[0]).pic + '/contain?height=600&width=800';
			var styles = {background: 'url(' + src + ')' + ' no-repeat center'};
			return (
				<div className={imgClasses}>
					<div className='Cross' onClick={self.props.onClose}></div>
					<div className='bAlbumFullscreenWrapper' style={styles}>
					</div>
				</div>
			);
		}
		return <span></span>;
	}

});

module.exports = FullScreenList;
