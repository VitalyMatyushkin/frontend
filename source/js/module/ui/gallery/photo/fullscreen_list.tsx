/**
 * Created by vitaly on 27.11.17.
 */

import * as React from 'react';

export interface FullScreenProps {
    photos: Photo[],
    onClose: () => void,
    startPhoto: string
}

interface FullScreenState {
    currentIndex: 	number,
    windowWidth: 	number,
    windowHeight: 	number
}

interface Photo {
    id: string
    picUrl: string
}

export class FullScreenList extends React.Component<FullScreenProps, FullScreenState> {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 	0,
            windowWidth: 	window.innerWidth,
            windowHeight: 	window.innerHeight
        };
    }

    componentDidMount() {
        this.setState({currentIndex: this.getStartIndex()});
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    onPhotoClick(): void {
        const   length = this.props.photos.length,
                currentIndex = (this.state.currentIndex + 1) % length;
        this.setState({currentIndex});
    }

    handleResize(): void {
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    }

    getStartIndex(): number {
        const photos = this.props.photos;
        let index = 0;
        for (let i = 0; i < photos.length; i++) {
            if (photos[i].id === this.props.startPhoto) {
                index = i;
                break;
            }
        }
        return index;
    }

    render () {
        const 	src 		= (window as any).Server.images.getResizedToHeightUrl(this.props.photos[this.state.currentIndex].picUrl, 800),
                width 		= this.state.windowWidth * 0.8,
                height 		= this.state.windowHeight * 0.8,
                topOffset 	= height * 0.5,
                leftOffset 	= width * 0.5;

        const styles = {
            marginTop: -topOffset,
            marginLeft: -leftOffset,
            width: width,
            height: height,
            backgroundImage: 'url('+ src +')'
        };

        return (
            <div className='bAlbumFullscreenList'>
                <div className='bAlbumFullscreenWrapper'>
                    <div className='eAlbumFullscreenList_image' style={styles} onClick={() => this.onPhotoClick()}>
                        <div className='eAlbumFullscreenList_cross' onClick={() => this.props.onClose()}></div>
                    </div>
                </div>
            </div>
        );
    }
}