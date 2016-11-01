/**
 * Created by Anatoly on 31.10.2016.
 */
const	React					= require('react'),
        PreviewPhoto			= require('./preview_photo');

const 	PHOTO_WIDTH = 240,
		LAYOUT_WIDTH = 940;

const Gallery = React.createClass({
    propTypes: {
        photos:							React.PropTypes.array.isRequired,
        handleClickDeletePhoto:			React.PropTypes.func,
        handleClickPhoto:			    React.PropTypes.func,
        accessMode:						React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
			currentPhoto:0
        };
    },
    renderPhotos: function() {
        const photos = this.props.photos.map( photo =>
            <PreviewPhoto	key								= { photo.id }
                             id								= { photo.id }
                             url							= { photo.picUrl }
                             accessMode						= { this.props.accessMode }
                             handleClickPhoto				= { this.props.handleClickPhoto }
                             handleClickDeletePhoto			= { this.props.handleClickDeletePhoto }
            />);

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
		index = index >= countPhotos - Math.floor(LAYOUT_WIDTH/PHOTO_WIDTH) ? index : index+1;

		this.setState({
			currentPhoto: index
		});
	},
    render: function() {
		const 	countPhotos = this.props.photos && this.props.photos.length,
				widthStrip 	= countPhotos * PHOTO_WIDTH,
				offset = this.state.currentPhoto*PHOTO_WIDTH,
				margin = offset + LAYOUT_WIDTH <= widthStrip ? -offset : LAYOUT_WIDTH - widthStrip,
				style 		= {width:widthStrip, marginLeft:margin};

        return (
        	<div>
				<div className="bPhotos">
					<div className="ePhotoStrip" style={style}>
						{ this.renderPhotos() }
					</div>
				</div>
				<div className="eArrow mLeft" onClick={this.onLeft} />
				<div className="eArrow mRight" onClick={this.onRight} />
			</div>
        );
    }
});

module.exports = Gallery;
