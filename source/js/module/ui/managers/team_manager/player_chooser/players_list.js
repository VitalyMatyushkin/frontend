const	React		= require('react'),
		Player		= require('./player');

const PlayersList = React.createClass({
	propTypes: {
		players:					React.PropTypes.array.isRequired,
		handleClickStudent:			React.PropTypes.func.isRequired
	},
	render: function() {
		const self = this;

		return (
			<div className="ePlayerChooser_playerList">
				{
					self.props.players.map(player =>
						<Player	key={player.id}
								player={player}
								handleClickStudent={self.props.handleClickStudent}
						/>
					)
				}
			</div>
		);
	}
});

module.exports = PlayersList;