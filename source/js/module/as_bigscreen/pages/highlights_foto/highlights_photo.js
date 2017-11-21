const	React	= require('react'),
		Photo	= require('module/as_bigscreen/pages/highlights_foto/photo'),
		Helper	= require('module/as_bigscreen/pages/highlights_foto/helper'),
		Style	= require('styles/ui/bid_screen_fixtures/bHighlightsPhoto.scss');

const HighlightsPhoto = React.createClass({
	propTypes: {
		eventId:	React.PropTypes.string.isRequired,
		photos:		React.PropTypes.array.isRequired
	},
	getInitialState: function(){
		return {
			photoStyleArray: []
		};
	},
	componentWillReceiveProps: function(nextProps) {
		if(nextProps.eventId !== this.props.eventId) {
			this.setState({
				photoStyleArray: Helper.getPhotoStyleArray(nextProps.photos)
			});
		}
	},
	componentWillMount: function () {
		// set init state of photo style array
		// this state is constant in all lifecycle of this component
		this.setState({
			photoStyleArray: Helper.getPhotoStyleArray(this.props.photos)
		});
	},
	renderPhotos: function () {
		const photoStyleArray = this.state.photoStyleArray;

		let isBigPhotoExist = false;
		return photoStyleArray.map((data, i, array) => {
			let isSmall;
			// always big size if photo count less then 3
			if(array.length < 3) {
				isSmall = false;
			} else {
				// always small if there is one big photo
				if(!isBigPhotoExist) {
					isBigPhotoExist = true;
					isSmall = false;
				} else {
					isSmall = true;
				}
			}

			return (
				<Photo
					style	= { data }
					isSmall	= { isSmall }
				/>
			)
		});
	},
	render: function() {
		return (
			<div className="bHighlightsPhoto">
				{ this.renderPhotos() }
			</div>
		);
	}
});

module.exports = HighlightsPhoto;