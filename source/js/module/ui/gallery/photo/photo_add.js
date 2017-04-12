/**
 * Created by Woland on 11.04.2017.
 */
const 	React 			= require('react'),
		Button 			= require('module/ui/button/button'),
		If 				= require('module/ui/if/if'),
		ReactCrop 		= require('react-image-crop'),
		CropImageHelper = require('module/helpers/crop_image_helper');

const 	PhotoAddStyles 	= require('styles/ui/gallery/b_photo_add.scss'),
		ReactCropStyles	= require('react-image-crop/lib/ReactCrop.scss');

const 	ReactCropConfig = {
	width : 100,
	aspect: 16/9
};

const PhotoAddComponent = React.createClass({
	propTypes: {
		service: React.PropTypes.object.isRequired
	},
	getInitialState: function(){
		return {
			fileImage: ''
		}
	},

	onCancelButtonClick: function(){
		window.history.back();
	},
	onCropButtonClick: function(){
		const 	canvas 	= this.refs.canvasImage,
				file 	= CropImageHelper.dataURLtoFile(canvas.toDataURL("image/jpeg"), 'image-squadintouch.jpeg');
		
		window.Server.images.upload(file)
		.then( picUrl => {
			const 	albumId = this.getAlbumId(),
				model 	= {
					name:           "",
					description:    "",
					picUrl:         picUrl
				};
			return this.props.service.photos.post(albumId, model);
		})
		.then(() => {
			window.simpleAlert(
				'Your image has successfully upload!',
				'Ok',
				() => {
					window.history.back();
					window.location.reload();
				}
			);
		});
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
	
	onInputFileImageChange: function(event){
		const file = event.target.files.item(0);
		const imageType = /^image\//;
		
		if (!file || !imageType.test(file.type)) {
			return;
		}
		
		const reader = new window.FileReader();
		
		reader.onload = (e2) => {
			this.setState({fileImage: e2.target.result});
		};
		
		reader.readAsDataURL(file);
	},
	isFileImage: function(){
		return this.state.fileImage !== '';
	},
	
	getAlbumId: function(){
		const hash = window.location.hash;
		//example hash: #school-albums/view/albumId/add
		//example hash.split('/'): [#school-albums, view, albumId, add]
		return hash.split('/')[2];
	},

	render: function(){
		return (
			<div className="bPhotoAdd">
				<div className="eInputFileImage">
					<input
						key			= "input-file-image"
						type		= "file"
						accept 		= "image/*"
						onChange	= { this.onInputFileImageChange }
					/>
				</div>
				<If condition={this.isFileImage()}>
					<div>
						<ReactCrop
							src 			= { this.state.fileImage }
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
								src 		= { this.state.fileImage }
								ref 		= "imageSrc"
								className 	= "mDisplayNone"
							/>
						</canvas>
					</div>
				</If>
				<div className="bButtonsPhotoAdd">
					<Button
						text 				= "Cancel"
						extraStyleClasses 	= "mMarginRight mCancel"
						onClick 			= { this.onCancelButtonClick }
					/>
					<If condition={this.isFileImage()}>
						<Button
							text		= "Crop & Upload image"
							onClick		= { this.onCropButtonClick }
						/>
					</If>
				</div>
			</div>
		)
	}
});

module.exports = PhotoAddComponent;