const	React			= require('react'),
		DefaultHeader	= require('./../default_header');

const BigHighlightsPhoto = React.createClass({

	propTypes: {
		photos: React.PropTypes.array.isRequired
	},

	getRandomPhoto: function() {
		const 	photos			= this.props.photos,
				maxRand = photos.length;

		let rand = Math.random() * (maxRand - 1);
		rand = Math.round(rand);

		return rand;
	},

	render: function() {
		const 	photos			= this.props.photos,
				defaultPhoto 	= '//images.squadintouch.com/images/3txvxdlvjkcm65e13re3nbeuoyoft8pwnhd3_1478107508550.jpg',	// hack not to brake page when there is no photos. TODO: fix me
				photo0Url		= photos[0] ? photos[this.getRandomPhoto()].picUrl : defaultPhoto,
				photo1Url		= photos[1] ? photos[this.getRandomPhoto()].picUrl : defaultPhoto,
				photo2Url		= photos[2] ? photos[this.getRandomPhoto()].picUrl : defaultPhoto;



		const styles = [
			{
				backgroundImage: `url(${window.Server.images.getResizedToHeightUrl(photo0Url, 500)})`
			},
			{
				backgroundImage: `url(${window.Server.images.getResizedToHeightUrl(photo1Url, 500)})`
			},
			{
				backgroundImage: `url(${window.Server.images.getResizedToHeightUrl(photo2Url, 500)})`
			}
		];

		return (
			<div className="bBigHighlightsPhoto">
				<div className="eBigHighlightsPhoto_titleContainer">
					<DefaultHeader title={"EVENT HIGHLIGHT"} logo={"images/big-logo-green.svg"}/>
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