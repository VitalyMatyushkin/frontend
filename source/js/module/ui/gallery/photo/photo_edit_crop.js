/**
 * Created by Woland on 07.04.2017.
 */
const 	React 			= require('react'),
		ReactCrop 		= require('react-image-crop'),
		Button 			= require('module/ui/button/button'),
		StorageHelper 	= require('module/helpers/storage');

const 	ReactCropStylesCustom 	= require('styles/ui/gallery/b_react_crop.scss'),
		ReactCropStyles			= require('react-image-crop/lib/ReactCrop.scss');

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
	
	componentDidMount: function(){
		const 	imageObject = this.refs.imageSrc,
				canvas 		= this.refs.canvasImage;
		
		/*imageObject.crossOrigin = 'anonymous';
		imageObject.src = this.props.src;*/
		
		/*this.toDataUrl(this.props.src, (result) => {
			console.log(result);
		});*/
		imageObject.style.display = 'none';
		canvas.style.display = 'none';
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
	/**
	 * Function return new file, created from canvas, for sending to server
	 * @param {string} dataurl
	 * @param {string} filename
	 * @returns {File}
	 */
	dataURLtoFile: function(dataurl, filename) {
		const 	arr 	= dataurl.split(','),
				mime 	= arr[0].match(/:(.*?);/)[1],
				bstr 	= window.atob(arr[1]);
		
		let 	n 		= bstr.length,
				u8arr 	= new window.Uint8Array(n);
		
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		
		return new window.File([u8arr], filename, {type:mime});
	},
	
	onCropClick: function(){
		const 	canvas 	= this.refs.canvasImage,
				file 	= this.dataURLtoFile(canvas.toDataURL("image/jpeg"), 'image-squadintouch.jpeg');
		
		window.Server.images.upload(file).then( picUrl => {
			const 	albumId = this.props.albumId,
					model 	= {
						name:           "",
						description:    "",
						picUrl:         picUrl
					};
			return this.props.service.photos.post(albumId, model);
		});
	},
	
	/*toDataUrl: function (url, callback) {
		const xhr = new XMLHttpRequest();
		
		xhr.onload = function() {
			const reader = new window.FileReader();
			reader.onloadend = function() {
				callback(reader.result);
			};
			reader.readAsDataURL(xhr.response);
		};
		xhr.open('GET', url);
		xhr.responseType = 'blob';
		xhr.send();
	},*/
	
	render: function(){
		return (
			<div className="bReactCrop">
				<ReactCrop
					src 			= { this.props.src }
					minWidth 		= { 10 }
					minHeight 		= { 10 }
					crop 			= { ReactCropConfig }
					keepSelection 	= { true }
					onComplete 		= { this.onCropComplete }
				/>
				<canvas ref="canvasImage">
					<img
						src 		= { this.props.src }
						crossOrigin = "anonymous"
						ref 		= "imageSrc"
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