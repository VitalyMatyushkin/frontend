const React = require('react');

const HighlightsPhoto = React.createClass({

	propTypes: {
		photos: React.PropTypes.array.isRequired
	},

	render: function() {
		const photos = this.props.photos;

		const styles = [
			{
				backgroundImage: `url(${window.Server.images.getResizedToHeightUrl(photos[0].picUrl, 300)})`
			},
			{
				backgroundImage: `url(${window.Server.images.getResizedToHeightUrl(photos[1].picUrl, 300)})`
			},
			{
				backgroundImage: `url(${window.Server.images.getResizedToHeightUrl(photos[2].picUrl, 300)})`
			}
		];

		return (
			<div className="bHighlightsPhoto">
				<div	className	= "eHighlightsPhoto_Photo"
						style		= {styles[0]}
				>
				</div>
				<div	className	= "eHighlightsPhoto_smallPhoto"
						style		= {styles[1]}
				>
				</div>
				<div	className	= "eHighlightsPhoto_smallPhoto"
						style		= {styles[2]}
				>
				</div>
			</div>
		);
	}
});

module.exports = HighlightsPhoto;