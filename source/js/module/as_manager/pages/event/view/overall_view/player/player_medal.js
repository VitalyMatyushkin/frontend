const 	React 		= require('react'),
		SportHelper	= require('module/helpers/sport_helper');

const PlayerInfo = React.createClass({
	propTypes: {
		playerPlace : React.PropTypes.number,
		isShowMedal	: React.PropTypes.bool.isRequired
	},
	render: function() {
		const 	isShowMedal 	= this.props.isShowMedal,
				place 			= this.props.playerPlace;

		let medal = null;

		if (isShowMedal) {
			let placeNameStyle;

			switch (place) {
				case 1:
					placeNameStyle = 'mFirstPlace';
					break;
				case 2:
					placeNameStyle = 'mSecondPlace';
					break;
				case 3:
					placeNameStyle = 'mThirdPlace';
					break;
				default:
					placeNameStyle = '';
					break;
			}

			if(placeNameStyle !== '') {
				medal = (
					<div className={'ePlayer_medal ' + placeNameStyle}>
					</div>
				);
			}
		}

		return (
			<div className='eOverallPlayer_medal'>
				{medal}
			</div>
		);
	}
});

module.exports = PlayerInfo;