/**
 * Created by Woland on 07.04.2017.
 */
const 	React 			= require('react'),
		ReactCrop 		= require('react-image-crop'),
		Button 			= require('module/ui/button/button'),
		CropImageHelper = require('module/helpers/crop_image_helper');

const 	ReactCropStylesCustom 	= require('styles/ui/gallery/b_photo_edit.scss'),
		ReactCropStyles			= require('react-image-crop/lib/ReactCrop.scss');

//Documentation: https://github.com/DominicTobias/react-image-crop
const 	ReactCropConfig = {
	width : 100,
	aspect: 16/9
};

const PhotoEditCrop = React.createClass({
	propTypes: {
		src: 		React.PropTypes.string.isRequired,
		albumId: 	React.PropTypes.string.isRequired,
		service: 	React.PropTypes.object.isRequired
	},
	
	onCancelClick: function(){
		window.history.back();
	},
	
	onCropComplete: function(crop, pixelCrop){
		const 	canvas 			= this.refs.canvasImage,
				imageObject 	= this.refs.imageSrc;
				
		canvas.width = pixelCrop.width;
		canvas.height = pixelCrop.height;
		
		canvas
			.getContext("2d")
			.drawImage(imageObject, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
	},
	
	onCropClick: function(){
		const 	canvas 	= this.refs.canvasImage,
				file 	= CropImageHelper.dataURLtoFile(canvas.toDataURL("image/jpeg"), 'image-squadintouch.jpeg');
		
		window.Server.images.upload(file)
		.then( picUrl => {
			const 	albumId = this.props.albumId,
					model 	= {
						name:           "",
						description:    "",
						picUrl:         picUrl
					};
			return this.props.service.photos.post(albumId, model);
		})
		.then( () => {
			window.simpleAlert(
				'Your image has successfully crop!',
				'Ok',
				() => {
					//TODO: one need to use router here, but currently our router is kind of shit and unable to perform that kind of ops
					window.history.back();
					window.location.reload();
				}
			);
		});
	},
	
	render: function(){
		return (
			<div className="bImageCrop">
				<ReactCrop
					src 			= { this.props.src }
					minWidth 		= { 10 }
					minHeight 		= { 10 }
					crop 			= { ReactCropConfig }
					keepSelection 	= { true }
					onComplete 		= { this.onCropComplete }
				/>
				<canvas
					ref 		= "canvasImage"
					className 	= "mDisplayNone"
				>
					<img
						src 		= { this.props.src }
						crossOrigin = "anonymous"
						ref 		= "imageSrc"
						className 	= "mDisplayNone"
					/>
				</canvas>
				<div className="bReactCropButtons">
					<Button text="Crop Image" extraStyleClasses="mMarginRight" onClick={this.onCropClick} />
					<Button text="Cancel" extraStyleClasses="mCancel" onClick={this.onCancelClick} />
				</div>
			</div>
		);
	}
});

module.exports = PhotoEditCrop;