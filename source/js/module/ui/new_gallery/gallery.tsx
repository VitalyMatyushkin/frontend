/**
 * Created by vitaly on 28.11.17.
 */

import * as React                   from 'react';
import * as PhotoStrip              from './photo_strip';
import * as FullScreenPhoto         from './fullscreen_photo';
import * as GalleryAccessPresets    from './../../helpers/consts/gallery';

export interface GalleryProps {
    currentUserId:					string,
    photos:							Photo[],
    handleChangeAddPhotoButton:		() => void,
    handleChangeAccessPreset:		(id: string, preset: string) => void,
    handleClickDeletePhoto:			() => void,
    accessMode:						string,
    isUserCanUploadPhotos:			boolean,
    isLoading:						boolean,
    isUploadingPhoto:				boolean
}

interface GalleryState {
    mode:						string,
    currentFullScreenPhotoId:	string
}

interface Photo {
    id: string,
    picUrl: string,
    accessPreset: string
}

export class Gallery extends React.Component<GalleryProps, GalleryState> {

    readonly PREVIEW_MODE = "PREVIEW_MODE";
    readonly FULLSCREEN_MODE = "FULLSCREEN_MODE";

    constructor(props) {
        super(props);
        this.state = {
            mode: this.PREVIEW_MODE,
            currentFullScreenPhotoId: undefined
        };
    }

    isShowArrowButtons() {
        return this.props.photos.length > 1;
    }

    isShowSideContainer(currentPhoto) {
        switch (this.props.accessMode) {
            case GalleryAccessPresets.GALLERY_ACCESS_PRESET.MANAGER:
                return true;
            case GalleryAccessPresets.GALLERY_ACCESS_PRESET.STUDENT:
                return false;
            case GalleryAccessPresets.GALLERY_ACCESS_PRESET.PARENT:
                return (currentPhoto.author.role === 'PARENT' && currentPhoto.author.userId === this.props.currentUserId);
            case GalleryAccessPresets.GALLERY_ACCESS_PRESET.PUBLIC:
                return false;
        }
    }
    /**
     * Get index of current full screen photo from prop.photos array
     * @returns {number}
     */
    getCurrentPhotoIndex() {
        return this.props.photos.findIndex(p => p.id === this.state.currentFullScreenPhotoId);
    }

    handleClickPhoto(id: string) {
        this.setState({
            mode: this.FULLSCREEN_MODE,
            currentFullScreenPhotoId: id
        });
    }

    handleClickCloseFullScreenPhoto() {
        this.setState({
            mode: this.PREVIEW_MODE,
            currentFullScreenPhotoId: undefined
        });
    }

    handleChangeAccessPreset(id: string, preset: string) {
        this.props.handleChangeAccessPreset(id, preset);
    }

    handleClickPrevPhoto() {
        const currentPhotoIndex = this.getCurrentPhotoIndex();

        let currentFullScreenPhotoId;
        if(currentPhotoIndex === 0) {
            currentFullScreenPhotoId = this.props.photos[this.props.photos.length - 1].id;
        } else {
            currentFullScreenPhotoId = this.props.photos[currentPhotoIndex - 1].id;
        }

        this.setState( {currentFullScreenPhotoId: currentFullScreenPhotoId} );
    }

    handleClickNextPhoto() {
        const currentPhotoIndex = this.getCurrentPhotoIndex();

        let currentFullScreenPhotoId;
        if(currentPhotoIndex === this.props.photos.length - 1) {
            currentFullScreenPhotoId = this.props.photos[0].id;
        } else {
            currentFullScreenPhotoId = this.props.photos[currentPhotoIndex + 1].id;
        }

        this.setState( {currentFullScreenPhotoId: currentFullScreenPhotoId} );
    }

    renderPhotos() {
        return (
            <PhotoStrip
                photos                  = { this.props.photos }
                handleClickDeletePhoto  = { this.props.handleClickDeletePhoto }
                handleClickPhoto        = { this.handleClickPhoto.bind(this) }
                accessMode              = { this.props.accessMode }
                isUploadingPhoto        = { this.props.isUploadingPhoto }
            />
        );
    }

    renderAddPhotoButton() {
        switch (this.props.accessMode) {
            case GalleryAccessPresets.GALLERY_ACCESS_PRESET.PUBLIC:
                return null;
            default:
                return (
                    null
                );
        }
    }

    renderFullScreenPhoto() {
        if(this.state.mode === this.FULLSCREEN_MODE) {
            const currentPhoto = this.props.photos.find(p => p.id === this.state.currentFullScreenPhotoId);
            return (
                <FullScreenPhoto
                    id							= { currentPhoto.id }
                    url							= { currentPhoto.picUrl }
                    isShowArrowButtons			= { this.isShowArrowButtons() }
                    isShowSideContainer			= { this.isShowSideContainer(currentPhoto)}
                    handleClickPrevPhoto		= { this.handleClickPrevPhoto.bind(this) }
                    handleClickNextPhoto		= { this.handleClickNextPhoto.bind(this) }
                    handleClickClose			= { this.handleClickCloseFullScreenPhoto.bind(this) }
                    currentAccessPreset			= { currentPhoto.accessPreset }
                    handleChangeAccessPreset	= { this.handleChangeAccessPreset.bind(this, currentPhoto.id)  }
                    accessMode					= { this.props.accessMode }
                />
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="bGallery">
                { this.renderPhotos() }
                { this.renderAddPhotoButton() }
                { this.renderFullScreenPhoto() }
            </div>
        );
    }
}