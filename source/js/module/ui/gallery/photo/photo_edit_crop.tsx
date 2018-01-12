/**
 * Created by Woland on 07.04.2017.
 */

import * as React from 'react';
import * as ReactCrop from 'react-image-crop';
import * as CropImageHelper from 'module/helpers/crop_image_helper';
import {Button} from 'module/ui/button/button';
import 'styles/ui/gallery/b_photo_edit.scss';
import 'react-image-crop/lib/ReactCrop.scss';

//Documentation: https://github.com/DominicTobias/react-image-crop
const 	ReactCropConfig = {
	width : 100,
	aspect: 3/1
};

interface PhotoEditCropProps {
	src: 		string
	albumId: 	string
	service: 	any
}

interface PixelCrop {
	width: 	number
	height: number
	x: 		number
	y: 		number
	aspect:	number
}

export class PhotoEditCrop extends React.Component<PhotoEditCropProps> {
	onCancelClick(): void {
		window.history.back();
	}
	
	onCropComplete(crop: any, pixelCrop: PixelCrop ): void {
		const 	canvas 			= this.refs.canvasImage,
				imageObject 	= this.refs.imageSrc;
		
		(canvas as any).width = pixelCrop.width;
		(canvas as any).height = pixelCrop.height;
		
		(canvas as any)
			.getContext("2d")
			.drawImage(imageObject, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
	}
	
	onCropClick(): void {
		const 	canvas 	= this.refs.canvasImage,
				file 	= CropImageHelper.dataURLtoFile((canvas as any).toDataURL("image/jpeg"));
		
		(window as any).Server.images.upload(file)
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
				(window as any).simpleAlert(
					'Your image has been successfully cropped!',
					'Ok',
					() => {
						//TODO: one need to use router here, but currently our router is kind of shit and unable to perform that kind of ops
						window.history.back();
						window.location.reload();
					}
				);
			});
	}
	
	render() {
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
						ref 		= "imageSrc"
						className 	= "mDisplayNone"
					/>
				</canvas>
				<div className="bReactCropButtons">
					<Button text="Crop Image" extraStyleClasses="mMarginRight" onClick={() => this.onCropClick()} />
					<Button text="Cancel" extraStyleClasses="mCancel" onClick={() => this.onCancelClick()} />
				</div>
			</div>
		);
	}
}