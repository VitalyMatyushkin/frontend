const	React			= require('react'),

		DefaultHeader	= require('./../default_header');

const BigHighlightsPhoto = React.createClass({

	propTypes: {
		photos: React.PropTypes.array.isRequired
	},

	render: function() {
		const photos = this.props.photos;

		const styles = [
			{
				backgroundImage: `url(${window.Server.images.getResizedToHeightUrl(photos[0].picUrl, 500)})`
			},
			{
				backgroundImage: `url(${window.Server.images.getResizedToHeightUrl(photos[1].picUrl, 500)})`
			},
			{
				backgroundImage: `url(${window.Server.images.getResizedToHeightUrl(photos[2].picUrl, 500)})`
			}
		];

		return (
			<div className="bBigHighlightsPhoto">
				<div className="eBigHighlightsPhoto_titleContainer">
					<DefaultHeader title={"TESTTESTEST"}/>
				</div>
				<div	className	= "eHighlightsPhoto_smallPhoto"
						style		= {styles[1]}
				>
				</div>
				<div	className	= "eHighlightsPhoto_smallPhoto"
						style		= {styles[2]}
				>
				</div>
				<div	className	= "eHighlightsPhoto_Photo"
						style		= {styles[0]}
				>
				</div>

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

module.exports = BigHighlightsPhoto;