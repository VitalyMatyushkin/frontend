
import * as React from 'react';
import * as Immutable from 'immutable';
import * as Morearty from 'morearty';
import {rotateImage} from '../rotateModel';
import {isCanvasSupported} from '../rotateModel';
import {SVG} from 'module/ui/svg';
import * as CropImageHelper from 'module/helpers/crop_image_helper';

interface AlbumPhotoProps {
	onPhotoClick: 		(photo: any) => void
	reloadPhotoList: 	() => void
	onPhotoPin: 		(photo: any) => void
	service:        	any
}

const ANGLE = {
	LEFT: -Math.PI/2,
	RIGHT: Math.PI/2
};

export const Photo = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: () => {
		return Immutable.fromJS({
			loaded: false
		});
	},
	componentWillMount:function() {
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
	componentWillUpdate:function() {
		const 	photo 		= this.getDefaultBinding(),
				photoId 	= photo.get('id');
		
		this.photoId = photoId;
		this.picUrl = photo.get('picUrl');
		this.name = photo.get('name');
		this.description = photo.get('description');
	},
	onImageLoad: function(): void {
		this.getDefaultBinding().set('loaded', true);
	},
	
	onImageClick: function(): void {
		const binding = this.getDefaultBinding();
		
		this.props.onPhotoClick && this.props.onPhotoClick(binding.toJS());
	},
	onClickPinPhoto: function(): void {
		const photo = this.getDefaultBinding().toJS();
		
		this.props.onPhotoPin(photo);
	},
	onClickEditPhoto: function(): void {
		const path: string[] = window.location.hash.replace('#', '').split('/');
		path.splice(path.length-2, 2);
		const mainPath: string = path.join('/');
		
		document.location.hash = `${mainPath}/${this.albumId}/photo-edit/${this.photoId}`;
	},
	onClickDeletePhoto: function(): void {
		(window as any).confirmAlert(
			"The photo will be deleted.",
			"Ok",
			"Cancel",
			() => this.props.service.photo.delete(this.albumId, this.photoId).then( () => this.props.reloadPhotoList() ),
			() => {}
		);
	},
	onRotatePhoto: function(angle: number): void {
		(window as any).confirmAlert(
			"The photo will be rotated.",
			"Ok",
			"Cancel",
			() =>
				this.rotatePhoto(angle)
		);
	},
	rotatePhoto: function (angle: number): any {
		return rotateImage(this.picUrl, angle)
			.then((data) => {
				const file = CropImageHelper.dataURLtoFile(data, 'image-squadintouch.jpeg');
				(window as any).Server.images.upload(file)
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
				sizedSrc 		= (window as any).Server.images.getResizedToBoxUrl(origSrc, 200, 200), // yeah, size a bit hardcoded here
				background  	= {backgroundImage: 'url('+ sizedSrc +')'};
		
		let imgClasses = 'bAlbumPhoto';
		if (binding.get('loaded')) {
			imgClasses = imgClasses + ' bAlbumPhotoLoaded';
		}
		
		return (
			<div onClick={() => this.onImageClick()} className={imgClasses}>
				<div className='ePhotoActions'>
					<span onClick={() => this.onClickPinPhoto()} className="bTooltip" id="albumCover_button" data-description="Set Album Cover"><SVG icon="icon_pin"/></span>
					{isCanvasSupported() &&
					<span>
						<span onClick={this.onRotatePhoto.bind(this, ANGLE.LEFT)} className="bTooltip" id="albumLeftRotate_button" data-description="Rotate photo to left"><SVG icon="icon_rotate_left"/></span>
						<span onClick={this.onRotatePhoto.bind(this, ANGLE.RIGHT)} className="bTooltip" id="albumRightRotate_button" data-description="Rotate photo to right"><SVG icon="icon_rotate_right"/></span>
					</span>
					}
					<span onClick={() => this.onClickEditPhoto()} className="bTooltip" id="editPhoto_button" data-description="Edit Photo"><SVG icon="icon_edit"/></span>
					<span onClick={() => this.onClickDeletePhoto()} className="bTooltip" id="deletePhoto_button" data-description="Delete Photo"><SVG classes="ePhotoDelete" icon="icon_delete"/></span>
				</div>
				<span className='eAlbumPhoto_photoTitle' id="photo_title">{binding.get('description')}</span>
				<div className="img" style={background} onLoad={() => this.onImageLoad()}></div>
			</div>
		);
	}
});
