const 	React 		= require('react'),
		SportHelper	= require('module/helpers/sport_helper');

const PlayerInfo = React.createClass({
	propTypes: {
		playerIndex	: React.PropTypes.number.isRequired,
		player		: React.PropTypes.object.isRequired,
		playerPlace : React.PropTypes.number,
		isShowMedal	: React.PropTypes.bool.isRequired
	},
	renderPlace: function(){
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
		
		return medal;
	},
	render: function() {
		const	playerIndex	= this.props.playerIndex,
				player		= this.props.player;

		return (
			<div className="ePlayer_name">
				{ this.renderPlace() }
				<span>{`${playerIndex + 1}. `}</span>
				<span>{player.firstName}</span>
				<span>{player.lastName}</span>
			</div>
		);
	}
});

module.exports = PlayerInfo;