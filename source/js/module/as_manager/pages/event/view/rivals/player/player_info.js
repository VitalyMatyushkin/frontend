const React = require('react');

const PlayerInfo = React.createClass({
	propTypes: {
		playerIndex	: React.PropTypes.number.isRequired,
		player		: React.PropTypes.object.isRequired
	},
	render: function() {
		const	playerIndex	= this.props.playerIndex,
				player		= this.props.player;

		return (
			<span className="ePlayer_name">
				<span>{`${playerIndex + 1}. `}</span>
				<span>{player.firstName}</span>
				<span>{player.lastName}</span>
			</span>
		);
	}
});

module.exports = PlayerInfo;