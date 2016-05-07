const 	Immutable 	= require('immutable'),
		React 		= require('react'),
		SVG 				= require('module/ui/svg');

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
				origSrc 	= binding.get('picUrl'),
				sizedSrc 	= window.Server.images.getResizedToBoxUrl(origSrc, 200, 200), // yeah, size a bit hardcoded here
                background  = {backgroundImage: 'url('+ sizedSrc +')'};

		let imgClasses = 'bAlbumPhoto';
		if (binding.get('loaded')) {
			imgClasses = imgClasses + ' bAlbumPhotoLoaded';
		}

		return (
				<div onClick={self.onImageClick} className={imgClasses}>
					<div className='ePhotoActions'>
						<span onClick={self.onClickPinPhoto}><SVG icon="icon_pencil"/></span>
						<span ><SVG icon="icon_user"/></span>
						<span ></span>
						<span onClick={self.onClickEditPhoto}><SVG icon="icon_edit"/></span>
						<span onClick={self.onClickDeletePhoto}><SVG classes="ePhotoDelete" icon="icon_delete"/></span>
					</div>
					<span className='eAlbumPhoto_photoTitle'>{binding.get('description')}</span>
					<div className="img" style={background} onLoad={self.onImageLoad}></div>
				</div>
		);
	}
});

module.exports = AlbumPhoto;
