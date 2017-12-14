/**
 * Created by Woland on 11.04.2017.
 */

import * as React from 'react';
import {Button} from 'module/ui/button/button';
import {If} from 'module/ui/if/if';
import * as ReactCrop from 'react-image-crop';
import * as CropImageHelper from 'module/helpers/crop_image_helper';
import 'styles/ui/gallery/b_photo_add.scss';
import 'react-image-crop/lib/ReactCrop.scss';

const ReactCropConfig = {
	width : 100,
	aspect: 3/1
};

interface PixelCrop {
	width: 	number
	height: number
	x: 		number
	y: 		number
	aspect:	number
}

interface PhotoAddComponentProps {
	service: any
}

interface PhotoAddComponentState {
	fileImage: string
}

export class PhotoAddComponent extends React.Component<PhotoAddComponentProps, PhotoAddComponentState> {
	constructor(props) {
		super(props);
		this.state = {fileImage: ''};
	}
	
	onCancelButtonClick(): void {
		window.history.back();
	}
	
	onCropButtonClick(): void {
		const 	canvas 	= this.refs.canvasImage,
				file 	= CropImageHelper.dataURLtoFile((canvas as any).toDataURL("image/jpeg"), 'image-squadintouch.jpeg');

		(window as any).Server.images.upload(file)
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
				(window as any).simpleAlert(
					'The image has been successfully uploaded.',
					'Ok',
					() => {
						//TODO: one need to use router here, but currently our router is kind of shit and unable to perform that kind of ops
						window.history.back();
						window.location.reload();
					}
				);
			});
	}
	
	onCropComplete(crop: PixelCrop, pixelCrop: PixelCrop): void {
		this.resizeCanvas(crop, pixelCrop);
	}
	
	onImageLoaded(crop: PixelCrop, image: any, pixelCrop: PixelCrop): void {
		this.resizeCanvas(crop, pixelCrop);
	}
	
	resizeCanvas(crop: PixelCrop, pixelCrop: PixelCrop): void {
		const 	canvas 			= this.refs.canvasImage,
				imageObject 	= this.refs.imageSrc;
		
		(canvas as any).width = pixelCrop.width;
		(canvas as any).height = pixelCrop.height;
		
		(canvas as any)
			.getContext("2d")
			.drawImage(imageObject, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
	}
	
	onInputFileImageChange(event): void {
		const file = event.target.files.item(0);
		const imageType = /^image\//;
		
		if (!file || !imageType.test(file.type)) {
			return;
		}
		
		const reader = new (window as any).FileReader();
		
		reader.onload = (eventOnLoad) => {
			this.setState({
				fileImage: eventOnLoad.target.result
			});
		};
		
		reader.readAsDataURL(file);
	}
	
	isFileImageSelectInInput(): boolean {
		return this.state.fileImage !== '';
	}
	
	getAlbumId(): string {
		const hash = window.location.hash;
		//example hash: #school-albums/view/albumId/add
		//example hash.split('/'): [#school-albums, view, albumId, add]
		return hash.split('/')[2];
	}
	
	render(){
		return (
			<div className="bPhotoAdd">
				<div className="eInputFileImage">
					<input
						key			= "input-file-image"
						type		= "file"
						accept 		= "image/*"
						onChange	= { this.onInputFileImageChange.bind(this) }
					/>
				</div>
				<If condition={this.isFileImageSelectInInput()}>
					<div>
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
						<ReactCrop
							src 			= { this.state.fileImage }
							minWidth 		= { 10 }
							minHeight 		= { 10 }
							crop 			= { ReactCropConfig }
							keepSelection 	= { true }
							onComplete 		= { this.onCropComplete.bind(this) }
							onImageLoaded 	= { this.onImageLoaded.bind(this) }
						/>
					</div>
				</If>
				<div className="bButtonsPhotoAdd">
					<Button
						text 				= "Cancel"
						extraStyleClasses 	= "mMarginRight mCancel"
						onClick 			= { () => this.onCancelButtonClick() }
					/>
					<If condition={this.isFileImageSelectInInput()}>
						<Button
							text		= "Crop & Upload image"
							onClick		= { () => this.onCropButtonClick() }
						/>
					</If>
				</div>
			</div>
		)
	}
}