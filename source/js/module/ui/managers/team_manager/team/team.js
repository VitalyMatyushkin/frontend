const	React	= require('react'),
		Player	= require('./player');

const DefaultTeam = React.createClass({
	propTypes: {
		players:						React.PropTypes.array.isRequired,
		positions:						React.PropTypes.array.isRequired,
		handleClickPlayer:				React.PropTypes.func.isRequired,
		handleChangePlayerPosition:		React.PropTypes.func.isRequired,
		handleClickPlayerSub:			React.PropTypes.func.isRequired,
		handleClickRemovePlayerButton:	React.PropTypes.func.isRequired
	},
	/**
	 * Handler for click on remove player button
	 * @private
	 */
	handleClickRemoveButton: function() {
		const self = this;

		self.props.handleClickRemovePlayerButton();
	},
	_renderPlayers: function () {
		const	self		= this;

		const	players		= self.props.players,
				positions	= self.props.positions;

		return players.map(player =>
			<Player	key={player.id}
					player={player}
					positions={positions}
					handleClickPlayer={self.props.handleClickPlayer}
					handleChangePlayerPosition={self.props.handleChangePlayerPosition}
					handleClickPlayerSub={self.props.handleClickPlayerSub}
			/>
		);
	},
	render: function() {
		const self  = this;

		return (
			<div className="eTeamWrapper_teamManagerWrapper">
				<div className="bTeam mDefaultView">
					<div className="eTeam_player mHead">
						<div className="eTeam_playerItem mName">Name</div>
						<div className="eTeam_playerItem mForm">Form</div>
						<div className="eTeam_playerItem mPosition">Position</div>
						<div className="eTeam_playerItem mSub">Sub</div>
					</div>
					<div className="eTeam_playerList">
						{self._renderPlayers()}
					</div>
				</div>
				<div	className="eTeam_removeButton"
						onClick={self.handleClickRemoveButton}
				>
				</div>
			</div>
		);
	}
});

module.exports = DefaultTeam;