/**
 * Created by Woland on 11.04.2017.
 */
const 	React 			= require('react'),
		Button 			= require('module/ui/button/button'),
		If 				= require('module/ui/if/if'),
		ReactCrop 		= require('react-image-crop');

const 	PhotoAddStyles 	= require('styles/ui/gallery/b_photo_add.scss'),
		ReactCropStyles	= require('react-image-crop/lib/ReactCrop.scss');

const 	ReactCropConfig = {
	width : 100,
	aspect: 16/9
};

const PhotoAddComponent = React.createClass({
	getInitialState: function(){
		return {
			fileImage: ''
		}
	},
	onCancelButtonClick: function(){
		window.history.back();
	},
	onCropButtonClick: function(){
		console.log('crop');
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

	render: function(){
		return (
			<div className="bPhotoAdd">
				<div className="eInputFileImage">
					<input
						key			= "input-file-image"
						type		= "file"
						onChange	= { this.onInputFileImageChange }
					/>
				</div>
				<If condition={this.isFileImage()}>
					<ReactCrop
						src 			= { this.state.fileImage }
						minWidth 		= { 10 }
						minHeight 		= { 10 }
						crop 			= { ReactCropConfig }
						keepSelection 	= { true }
						onComplete 		= { this.onCropComplete }
					/>
				</If>
				<div className="bButtonsPhotoAdd">
					<Button
						text 				= "Cancel"
						extraStyleClasses 	= "mMarginRight mCancel"
						onClick 			= { this.onCancelButtonClick }
					/>
					<If condition={this.isFileImage()}>
						<Button
							text		= "Crop image"
							onClick		= { this.onCropButtonClick }
						/>
					</If>
				</div>
			</div>
		)
	}
});

module.exports = PhotoAddComponent;