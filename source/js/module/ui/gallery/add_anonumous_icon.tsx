import * as React from 'react';
import {AnonymousIcon} from './anonymous_icon/anonymous_icon';

interface AddAnonymousIconProps {
	service: any
}

interface AddAnonymousIconState {
	albumId: string
	photoId: string
	photoData: {accessPreset?: string, description?: string, id?: string, name?: string, picUrl?: string}
}

export class AddAnonymousIcon extends React.Component<AddAnonymousIconProps, AddAnonymousIconState> {
	constructor(props) {
		super(props);
		this.state = {
			albumId: this.getAlbumId(),
			photoId: this.getPhotoId(),
			photoData: {}
		};
	}

	handleSaveClick(file) {
		(window as any).Server.images.upload(file)
			.then( picUrl => {
				const model = {
					name:           this.state.photoData.name,
					description:    this.state.photoData.description,
					picUrl:         picUrl
				};
				this.props.service.photo.put(this.state.albumId, this.state.photoId, model)
					.then(() => window.history.back());
			});
	}

	getUrlPhoto() {
		return this.props.service.photo.get(this.state.albumId, this.state.photoId)
		.then((photoData) => {
			this.setState({photoData});
			return photoData.picUrl;
		});
	}

	getPhotoId(): string {
		return window.location.hash.split('/')[3];
	}

	getAlbumId(): string {
		return window.location.hash.split('/')[1];
	}

	render() {
		return (
			<AnonymousIcon
				handleSaveClick     = {(file) => this.handleSaveClick(file)}
				handleCancelClick   = {() => window.history.back()}
				getUrlPhoto         = {this.getUrlPhoto.bind(this)}
			/>
		);
	}
}