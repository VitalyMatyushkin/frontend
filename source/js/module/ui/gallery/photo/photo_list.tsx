import * as React from 'react';
import * as Immutable from 'immutable';
import * as Morearty from 'morearty';
import {If} from 'module/ui/if/if';
import {Photo} from './photo';
import {PhotoItem} from './photo_item';

interface PhotoListProps {
	onPhotoClick: 	() => void
	service: 		any
}

export const PhotoList = (React as any).createClass({
	mixins: [Morearty.Mixin],
	
    renderPhoto: function(photo: any, index: number): any {
        const binding = this.getDefaultBinding(),
        photosBinding = binding.sub('photos'),
        photoBinding = photosBinding.sub(index),
        photoId = photoBinding.get("id");

        return (
            <Photo
				binding			= {photoBinding}
				key				= {'photo-' + photoId}
				onPhotoClick	= {this.props.onPhotoClick}
				reloadPhotoList	= {this.reloadPhotoList}
				onPhotoPin		= {this.onPhotoPin}
				service 		= {this.props.service}
            />
        );
    },

    onPhotoPin: function(photo: PhotoItem) : void{
        const 	binding = this.getDefaultBinding(),
            	albumId = binding.get('id');
	
		this.props.service.photo.pin(albumId, photo.picUrl).then(() => {
			(window as any).simpleAlert(
                'Album cover is changed!',
                'Ok',
                () => {}
            );
        });
    },

    reloadPhotoList: function(): Promise<any> {
		const 	binding = this.getDefaultBinding(),
				albumId = binding.get('id');

        return this.props.service.photos.get(albumId,{filter:{limit: 100}}).then((res) =>{
            binding
                .atomically()
                .set('photos', Immutable.fromJS(res))
                .commit();

        });
    },

    render: function() {
        const 	binding 	= this.getDefaultBinding(),
            	isUploading = this.getBinding('isUploading').get();

        return (
			<div className="bAlbums_list">
				<If condition={isUploading}>
					<div className="bAlbumPhoto mUploading">uploading...</div>
				</If>
				{binding.get('photos').map(this.renderPhoto)}
			</div>
      	);
    }
});
