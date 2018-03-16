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
	windowWidth: number
	imageOriginSize: {width: number, height: number}
	imageShowSize: {width: number, height: number}
}

export class PhotoAddComponent extends React.Component<PhotoAddComponentProps, PhotoAddComponentState> {
	readonly MARGIN = 40;

	constructor(props) {
		super(props);
		this.state = {fileImage: '', windowWidth: window.innerWidth, imageOriginSize: {width: 0, height: 0},  imageShowSize: {width: 0, height: 0}};
	}
	
	onCancelButtonClick(): void {
		window.history.back();
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize.bind(this));
	}

	handleResize(): void {
		this.setState({
			windowWidth: window.innerWidth
		});
	}
	onCropButtonClick(): void {
		const 	canvas 	= this.refs.canvasImage,
				file 	= CropImageHelper.dataURLtoFile((canvas as any).toDataURL("image/jpeg"));

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
					}
				);
			});
	}
	
	onCropComplete(crop: PixelCrop, pixelCrop: PixelCrop): void {
		this.resizeCanvas(crop, pixelCrop);
	}
	
	onImageLoaded(crop: PixelCrop, image: any, pixelCrop: PixelCrop): void {
		this.setState({
			imageShowSize: {width: image.width, height: image.height}
		});
		this.resizeCanvas(crop, pixelCrop);
	}
	
	resizeCanvas(crop: PixelCrop, pixelCrop: PixelCrop): void {
		const 	canvas 			= this.refs.canvasImage,
				imageObject 	= this.refs.imageSrc;
		
		(canvas as any).width = pixelCrop.width;
		(canvas as any).height = pixelCrop.height;

		const   ratioX = this.state.imageOriginSize.width/this.state.imageShowSize.width,
				ratioY = this.state.imageOriginSize.height/this.state.imageShowSize.height;

		(canvas as any)
			.getContext("2d")
			.drawImage(imageObject, pixelCrop.x*ratioX, pixelCrop.y*ratioY, pixelCrop.width*ratioX, pixelCrop.height*ratioY, 0, 0, pixelCrop.width, pixelCrop.height);
	}
	
	onInputFileImageChange(event): void {
		const file = event.target.files.item(0);
		const imageType = /^image\//;
		
		if (!file || !imageType.test(file.type)) {
			return;
		}
		
		const reader = new (window as any).FileReader();
		
		reader.onload = (eventOnLoad) => {
			const image = new Image();
			image.src = eventOnLoad.target.result;
			image.onload = () => {
				this.setState({
					imageOriginSize: {width: image.width, height: image.height},
					fileImage: eventOnLoad.target.result
				});
			};
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
			<div className="bPhotoAdd" style={{maxWidth: this.state.windowWidth-this.MARGIN*2, marginLeft: this.MARGIN, marginRight: this.MARGIN}}>
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