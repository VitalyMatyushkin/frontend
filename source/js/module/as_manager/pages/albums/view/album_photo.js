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
	onClickEditPhoto: function(photo) {
		var self = this;

		if (self.isMounted()) {
			document.location.hash = 'albums/photo-edit/' + photo.get('id');
		}

		return false;
	},
	onClickDeletePhoto: function(photo) {
		var self = this,
				photoId = photo.get('id'),
				rootBinding = self.getMoreartyContext().getBinding(),
				albumId = rootBinding.get('routing.pathParameters.1');

		if(confirm("Delete this photo?"))
			window.Server.photo.delete(photoId).then(function() {
				console.log("onClickDeletePhoto: photoId = "+photoId+", albumId = "+albumId);

				self.props.onPhotoDelete();
			});

		return false;
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
			<div onClick={self.onImageClick} className={imgClasses} >
				<span onClick={self.onClickEditPhoto.bind(self, binding)} className='eAlbumPhoto_photoEdit'></span>
				<span onClick={self.onClickDeletePhoto.bind(self, binding)} className='eAlbumPhoto_photoDelete'></span>
				<img src={src} onLoad={self.onImageLoad} />
			</div>
		);
	}
});

module.exports = AlbumPhoto;
