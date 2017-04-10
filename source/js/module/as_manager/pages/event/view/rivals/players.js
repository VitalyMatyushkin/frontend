const	React	= require('react'),
		Player	= require('module/as_manager/pages/event/view/rivals/player/player');

const Players = React.createClass({
	propTypes: {
		players						: React.PropTypes.array.isRequired,
		teamId						: React.PropTypes.string,
		isOwner						: React.PropTypes.bool.isRequired,
		individualScoreAvailable	: React.PropTypes.bool.isRequired,
		mode						: React.PropTypes.string.isRequired,
		event						: React.PropTypes.object.isRequired,
		customCss					: React.PropTypes.string.isRequired
	},
	renderPlayers: function() {
		const players = this.props.players;

		//we sort array of players by individual score
		//this.sortPlayersByScore(players);

		return players.map((player, playerIndex) => {
			return (
				<Player
					key							= {playerIndex}
					playerIndex					= {playerIndex}
					player						= {player}
					teamId						= {this.props.teamId}
					isOwner						= {this.props.isOwner}
					individualScoreAvailable	= {this.props.individualScoreAvailable}
					mode						= {this.props.mode}
					event						= {this.props.event}
					customCss					= {this.props.customCss}
				/>
			);
		});
	},
	render: function() {
		return (
			<div className="bEventTeams_team">
				{this.renderPlayers()}
			</div>
		);
	}
});

module.exports = Players;