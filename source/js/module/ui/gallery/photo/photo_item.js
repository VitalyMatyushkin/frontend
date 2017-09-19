const	Immutable 			= require('immutable'),
		React 				= require('react'),
		Morearty    		= require('morearty'),
		rotateImage 		= require('../rotateModel').rotateImage,
		isCanvasSupported 	= require('../rotateModel').isCanvasSupported,
		CropImageHelper 	= require('module/helpers/crop_image_helper'),
		SVG 				= require('module/ui/svg');

const ANGLE = {
	LEFT: -Math.PI/2,
	RIGHT: Math.PI/2
};
const AlbumPhoto = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onPhotoClick: 		React.PropTypes.func,
		reloadPhotoList: 	React.PropTypes.func,
		onPhotoPin: 		React.PropTypes.func,
        service:        	React.PropTypes.object
	},
	getDefaultState: function() {
		return Immutable.fromJS({
			loaded: false
		});
	},
	componentWillMount:function(){
		const 	photo 		= this.getDefaultBinding(),
				photoId 	= photo.get('id'),
				rootBinding = this.getMoreartyContext().getBinding(),
				params      = rootBinding.toJS('routing.pathParameters'),
				albumId 	= params && params.length ? params[params.length-1] : null;

		this.albumId = albumId;
		this.photoId = photoId;
		this.picUrl = photo.get('picUrl');
		this.name = photo.get('name');
		this.description = photo.get('description');
	},
	componentWillUpdate:function(){
		const 	photo 		= this.getDefaultBinding(),
				photoId 	= photo.get('id');

		this.photoId = photoId;
		this.picUrl = photo.get('picUrl');
		this.name = photo.get('name');
		this.description = photo.get('description');
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
        const self = this;

        let path = window.location.hash.replace('#', '').split('/');
        path.splice(path.length-2, 2);
        path = path.join('/');

        document.location.hash = `${path}/${self.albumId}/photo-edit/${self.photoId}`;

		e.stopPropagation();
	},
	onClickDeletePhoto: function(e) {
		const 	self 		= this;

		window.confirmAlert(
			"The photo will be deleted.",
			"Ok",
			"Cancel",
			() => self.props.service.photo.delete(self.albumId, self.photoId).then( () => self.props.reloadPhotoList() ),
			() => {}
		);
		e.stopPropagation();
	},
	onRotatePhoto: function(angle, e) {
		window.confirmAlert(
			"The photo will be rotated.",
			"Ok",
			"Cancel",
			() =>
			this.rotatePhoto(angle)
		);
		e.stopPropagation();
	},
	rotatePhoto: function (angle) {
		return rotateImage(this.picUrl, angle)
		.then((data) => {
			const file = CropImageHelper.dataURLtoFile(data, 'image-squadintouch.jpeg');
			window.Server.images.upload(file)
				.then( picUrl => {
					const 	model 	= {
						name:           this.name,
						description:    this.description,
						picUrl:         picUrl
					};
					this.props.service.photo.put(this.albumId, this.photoId, model)
						.then(() => {this.props.reloadPhotoList()});
				});
		})
	},
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				origSrc 		= binding.get('picUrl'),
				sizedSrc 		= window.Server.images.getResizedToBoxUrl(origSrc, 200, 200), // yeah, size a bit hardcoded here
                background  	= {backgroundImage: 'url('+ sizedSrc +')'};

		let imgClasses = 'bAlbumPhoto';
		if (binding.get('loaded')) {
			imgClasses = imgClasses + ' bAlbumPhotoLoaded';
		}

		return (
				<div onClick={this.onImageClick} className={imgClasses}>
					<div className='ePhotoActions'>
						<span onClick={this.onClickPinPhoto} className="bTooltip" id="albumCover_button" data-description="Set Album Cover"><SVG icon="icon_pin"/></span>
						{isCanvasSupported() &&
							<span>
								<span onClick={this.onRotatePhoto.bind(this, ANGLE.LEFT)} className="bTooltip" id="albumLeftRotate_button" data-description="Rotate photo to left"><SVG icon="icon_rotate_left"/></span>
								<span onClick={this.onRotatePhoto.bind(this, ANGLE.RIGHT)} className="bTooltip" id="albumRightRotate_button" data-description="Rotate photo to right"><SVG icon="icon_rotate_right"/></span>
							</span>
						}
						<span onClick={this.onClickEditPhoto} className="bTooltip" id="editPhoto_button" data-description="Edit Photo"><SVG icon="icon_edit"/></span>
						<span onClick={this.onClickDeletePhoto} className="bTooltip" id="deletePhoto_button" data-description="Delete Photo"><SVG classes="ePhotoDelete" icon="icon_delete"/></span>
					</div>
					<span className='eAlbumPhoto_photoTitle' id="photo_title">{binding.get('description')}</span>
					<div className="img" style={background} onLoad={this.onImageLoad}></div>
				</div>
		);
	}
});

module.exports = AlbumPhoto;
