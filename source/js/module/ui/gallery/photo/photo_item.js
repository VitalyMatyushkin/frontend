const 	Immutable 	= require('immutable'),
		React 		= require('react');

const AlbumPhoto = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onPhotoClick: 	React.PropTypes.func,
		onPhotoDelete: 	React.PropTypes.func,
		onPhotoPin: 	React.PropTypes.func
	},

	getDefaultState: function() {
		return Immutable.fromJS({
			loaded: false
		});
	},

	onImageLoad: function() {
		this.getDefaultBinding().set('loaded', true);
	},

	onImageClick: function() {
		const 	self = this,
				binding = self.getDefaultBinding();

		self.props.onPhotoClick && self.props.onPhotoClick(binding.toJS());
	},
	onClickPinPhoto: function(e) {
		const 	self = this,
				photo = self.getDefaultBinding().toJS();

		self.props.onPhotoPin(photo);
		e.stopPropagation();
	},
	onClickEditPhoto: function(e) {
		var self = this,
			photo = self.getDefaultBinding().toJS();

		if (self.isMounted()) {
			document.location.hash = 'albums/photo-edit/' + photo.id;
		}

		e.stopPropagation();
	},
	onClickDeletePhoto: function(e) {
		const 	self 		= this,
				photo 		= self.getDefaultBinding(),
				photoId 	= photo.get('id'),
				rootBinding = self.getMoreartyContext().getBinding(),
				albumId 	= rootBinding.get('routing.pathParameters.1');

		if(confirm("Delete this photo?"))
			window.Server.photo.delete(photoId).then(function() {
				self.props.onPhotoDelete();
			});

		e.stopPropagation();
	},

	render: function() {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				origSrc 	= binding.get('pic'),
				sizedSrc 	= window.Server.images.getResizedToHeightUrl(origSrc, 200);

		let imgClasses = 'bAlbumPhoto';
		if (binding.get('loaded')) {
			imgClasses = imgClasses + ' bAlbumPhotoLoaded';
		}

		return (
			<div onClick={self.onImageClick} className={imgClasses} >
				<span onClick={self.onClickPinPhoto} className='eAlbumPhoto_photoPin'></span>
				<span onClick={self.onClickEditPhoto} className='eAlbumPhoto_photoEdit'></span>
				<span onClick={self.onClickDeletePhoto} className='eAlbumPhoto_photoDelete'></span>
				<span className='eAlbumPhoto_photoTitle'>{binding.get('description')}</span>
				<img src={sizedSrc} onLoad={self.onImageLoad} />
			</div>
		);
	}
});

module.exports = AlbumPhoto;
