/**
 * Created by Anatoly on 31.10.2016.
 */
const	React			= require('react'),
		PreviewPhoto	= require('./preview_photo'),
		Loader			= require('module/ui/loader'),
		classNames 		= require('classnames');

const 	PHOTO_WIDTH = 240,
		LAYOUT_WIDTH = 1140;

const	LoaderStyles	= require('styles/ui/gallery/b_loader_preview_photo.scss');

const PhotoStrip = React.createClass({
	propTypes: {
		photos:							React.PropTypes.array.isRequired,
		handleClickDeletePhoto:			React.PropTypes.func,
		handleClickPhoto:				React.PropTypes.func,
		accessMode:						React.PropTypes.string.isRequired,
		isUploadingPhoto:				React.PropTypes.bool,
		isLoading:				        React.PropTypes.bool
	},
	getInitialState: function() {
		return {
			currentPhoto:   0,
			windowWidth:	window.innerWidth
		};
	},
	componentDidMount() {
		window.addEventListener('resize', this.handleResize.bind(this));
	},
	componentDidUpdate(prevProps) {
		if (prevProps.photos !== this.props.photos) {
			const indexForScrolling = this.props.photos.length -
				Math.floor((this.state.windowWidth < LAYOUT_WIDTH ? this.state.windowWidth-60 : LAYOUT_WIDTH)/PHOTO_WIDTH);
			this.setState({
				currentPhoto: indexForScrolling > 0 ? indexForScrolling : 0
			});
		}
	},
	handleResize(){
		this.setState({
			windowWidth: window.innerWidth
		});
	},
	renderPhotos: function() {
		const photos = this.props.photos.map( photo =>
			<PreviewPhoto	 key							= { photo.id }
							 id								= { photo.id }
							 url							= { photo.picUrl }
							 accessMode						= { this.props.accessMode }
							 handleClickPhoto				= { this.props.handleClickPhoto }
							 handleClickDeletePhoto			= { this.props.handleClickDeletePhoto }
							 PhotoWidth 					= { PHOTO_WIDTH }
			/>);

		if (this.props.isLoading) {
			photos.push(
				<div className="bLoaderPreviewPhoto">
					<Loader condition={true} />
				</div>
			);
		}
		return photos;
	},
	onLeft:function(){
		let index = this.state.currentPhoto;
		index = index === 0 ? 0 : index-1;

		this.setState({
			currentPhoto: index
		});
	},
	onRight:function(){
		const 	countPhotos = this.props.photos && this.props.photos.length;

		let index = this.state.currentPhoto;
		index = index >= countPhotos -
		Math.floor((this.state.windowWidth < LAYOUT_WIDTH ? this.state.windowWidth-60 : LAYOUT_WIDTH)/PHOTO_WIDTH) ? index : index+1;

		this.setState({
			currentPhoto: index
		});
	},
	render: function() {
		console.log(this.state.windowWidth);
		const 	windowWidth = this.state.windowWidth < LAYOUT_WIDTH ? this.state.windowWidth-60 : LAYOUT_WIDTH,
				countPhotos = this.props.photos && this.props.photos.length,
				widthStrip 	= this.props.isLoading ? (countPhotos + 1) * PHOTO_WIDTH : countPhotos * PHOTO_WIDTH,
				offset = this.state.currentPhoto*PHOTO_WIDTH,
				margin = offset + windowWidth <= widthStrip || offset === 0 ? -offset : windowWidth - widthStrip,
				style 		= {width:widthStrip, marginLeft:margin},
				lBtnClasses = classNames({
					eArrow:true,
					mLeft:true,
					mHidden: offset === 0
				}),
				rBtnClasses = classNames({
					eArrow:true,
					mRight:true,
					mHidden: windowWidth > widthStrip || margin !== -offset
				});

			return (
				<div>
					<div className="bPhotos">
						<div className="ePhotoStrip" style={style}>
							{ this.renderPhotos() }
						</div>
					</div>
					<div className={lBtnClasses} onClick={this.onLeft} />
					<div className={rBtnClasses} onClick={this.onRight} />
				</div>
			);
	}
});

module.exports = PhotoStrip;
