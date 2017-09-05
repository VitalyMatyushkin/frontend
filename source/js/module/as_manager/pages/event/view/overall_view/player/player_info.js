const 	React 			= require('react'),
		SportHelper		= require('module/helpers/sport_helper');

const	OverallPlayersStyle	= require('../../../../../../../../styles/ui/b_overall_player.scss');

const PlayerInfo = React.createClass({
	propTypes: {
		playerIndex	: React.PropTypes.number.isRequired,
		player		: React.PropTypes.object.isRequired,
		playerPlace : React.PropTypes.number,
	},
	render: function() {
		const	playerIndex	= this.props.playerIndex,
				player		= this.props.player;

		return (
			<div className="eOverallPlayer_info">
				{`${playerIndex + 1}. ${player.firstName} ${player.lastName}`}
			</div>
		);
	}
});

module.exports = PlayerInfo;