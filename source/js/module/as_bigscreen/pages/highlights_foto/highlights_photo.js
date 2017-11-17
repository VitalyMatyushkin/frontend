const	React				= require('react'),
	BigScreenActions	= require('./../../actions/BigScreenActions');

const Style = require('styles/ui/bid_screen_fixtures/bHighlightsPhoto.scss');

const HighlightsPhoto = React.createClass({

	propTypes: {
		photos: React.PropTypes.array.isRequired
	},

	defaultPhoto: '//images.squadintouch.com/images/3txvxdlvjkcm65e13re3nbeuoyoft8pwnhd3_1478107508550.jpg',

	getPicUrlByOrder: function () {
		const photos = this.props.photos;

		const currentPic = photos[BigScreenActions.getRandomPhotoIndex(photos)];
		let picUrl = typeof currentPic !== 'undefined' ? currentPic.picUrl : this.defaultPhoto;

		return picUrl;
	},
	render: function() {
		const currentPicUrlArray = [
			window.Server.images.getResizedToHeightUrl(
				this.getPicUrlByOrder(0),
				300
			),
			window.Server.images.getResizedToHeightUrl(
				this.getPicUrlByOrder(1),
				300
			),
			window.Server.images.getResizedToHeightUrl(
				this.getPicUrlByOrder(2),
				300
			)
		];

		return (
			<div className="bHighlightsPhoto">
				<img	className	= "eHighlightsPhoto_img"
						src			= {currentPicUrlArray[0]}
				>
				</img>
				<img	className	= "eHighlightsPhoto_img mSmall"
						src			= {currentPicUrlArray[1]}
				>
				</img>
				<img	className	= "eHighlightsPhoto_img mSmall"
						src			= {currentPicUrlArray[2]}
				>
				</img>
			</div>
		);
	}
});

module.exports = HighlightsPhoto;