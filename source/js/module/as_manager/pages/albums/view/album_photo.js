const 	Immutable 	= require('immutable'),
		React 		= require('react');

const AlbumPhoto = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onPhotoClick: React.PropTypes.func,
		onPhotoDelete: React.PropTypes.func,
		onPhotoPin: React.PropTypes.func
	},

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
	onClickPinPhoto: function(e) {
		var self = this,
			photo = self.getDefaultBinding();

		self.props.onPhotoPin(photo);
		e.stopPropagation();
	},
	onClickEditPhoto: function(e) {
		var self = this,
			photo = self.getDefaultBinding();

		if (self.isMounted()) {
			document.location.hash = 'albums/photo-edit/' + photo.get('id');
		}

		e.stopPropagation();
	},
	onClickDeletePhoto: function(e) {
		var self = this,
			photo = self.getDefaultBinding(),
			photoId = photo.get('id'),
			rootBinding = self.getMoreartyContext().getBinding(),
			albumId = rootBinding.get('routing.pathParameters.1');

		if(confirm("Delete this photo?"))
			window.Server.photo.delete(photoId).then(function() {
				console.log("onClickDeletePhoto: photoId = "+photoId+", albumId = "+albumId);

				self.props.onPhotoDelete();
			});

		e.stopPropagation();
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
				<span onClick={self.onClickPinPhoto} className='eAlbumPhoto_photoPin'></span>
				<span onClick={self.onClickEditPhoto} className='eAlbumPhoto_photoEdit'></span>
				<span onClick={self.onClickDeletePhoto} className='eAlbumPhoto_photoDelete'></span>
				<span className='eAlbumPhoto_photoTitle'>{binding.get('description')}</span>
				<img src={src} onLoad={self.onImageLoad} />
			</div>
		);
	}
});

module.exports = AlbumPhoto;
