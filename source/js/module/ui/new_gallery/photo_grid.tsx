import * as React from 'react';
import * as  ReactDOM from 'react-dom';

interface  PhotoGridProps {
	photos:							any[]
	handleClickDeletePhoto:			(id: string) => void
	handleClickPhoto:				(id: string) => void
	isUploadingPhoto:				boolean
}

interface  PhotoGridState {
	windowWidth: number
	windowHeight: number
}

export class PhotoGrid extends React.Component< PhotoGridProps, PhotoGridState> {
	constructor(props) {
		super(props);
		this.setState({
			windowWidth:	window.innerWidth,
			windowHeight:	window.innerHeight
		});
	}

	componentWillMount() {
		this.setState({
			windowWidth:	window.innerWidth,
			windowHeight:	window.innerHeight
		});
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize.bind(this));
	}

	componentDidUpdate(prevProps) {
		if (prevProps.photos < this.props.photos ) {
			this.scrollToPhoto(this.props.photos[this.props.photos.length-1].id);
		}
	}

	handleResize(): void {
		this.setState({
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight
		});
	}

	scrollToPhoto(photoId) {
		ReactDOM.findDOMNode(this.refs[photoId] as any).scrollIntoView({ behavior: 'smooth' });
	}

	renderPhotos(): React.ReactNode {
		return (
			this.props.photos.map(photo => {
				const 	origSrc 		= photo.picUrl,
						sizedSrc 		= (window as any).Server.images.getResizedToBoxUrl(origSrc, 150, 450), // yeah, size a bit hardcoded here
						background  	= {backgroundImage: 'url('+ sizedSrc +')'};

				/*
				Why is length and width calculated? With the help of css only it is impossible to proportionally reduce the height of the block with the picture.
				Constants are taken from styles
				 */
				const   width = this.state.windowWidth > 920 ? 410 : (this.state.windowWidth-100)*0.5,
						height = width/3;

				return (
					<div className="bAlbumPhoto" style={{width, height}} ref={photo.id}>
						<div className="img" style={background} onClick={() => this.props.handleClickPhoto(photo.id)}></div>
						{typeof photo.name !== 'undefined' && photo.name !== '' ? <div className="bImg_name">{photo.name}</div> : null}
					</div>
				)
			})
		)
	}

	render() {
		return (
			<div className="bAlbums_list">
				{ this.renderPhotos() }
			</div>
		)
	}
}