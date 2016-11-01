/**
 * Created by Anatoly on 31.10.2016.
 */
const	React					= require('react'),
        PreviewPhoto			= require('./preview_photo');

const Gallery = React.createClass({
    propTypes: {
        photos:							React.PropTypes.array.isRequired,
        handleClickDeletePhoto:			React.PropTypes.func,
        handleClickPhoto:			    React.PropTypes.func,
        accessMode:						React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
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
    render: function() {
        return (
			<div className="bPhotoStrip">
				<div className="eStrip">
					{ this.renderPhotos() }
				</div>
			</div>
        );
    }
});

module.exports = Gallery;
