var AlbumPhoto = React.createClass({
	mixins: [Morearty.Mixin],

	getDefaultState: function() {
		return Immutable.fromJS({
			loaded: false
		});
	},

	onImageLoad: function() {
		var self = this,
		binding = self.getDefaultBinding();

		if (this.isMounted()) {
			binding.set('loaded', true);
		}
	},

	onImageClick: function() {
		var self = this,
		binding = self.getDefaultBinding();

		self.props.onPhotoClick(binding.get());
	},

	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		var imgClasses = 'bAlbumPhoto';
		if (binding.get('loaded')) {
			imgClasses = imgClasses + ' bAlbumPhotoLoaded';
		}
		var src = binding.get('pic') + '/contain?height=200';
		return (
			<img src={src} className={imgClasses} onLoad={self.onImageLoad} onClick={self.onImageClick} />
		);
	}
});

module.exports = AlbumPhoto;
