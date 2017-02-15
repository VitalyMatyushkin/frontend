const	React	= require('react'),

		Player				= require('./player'),
		ErrorItem			= require('./errorItem'),
		RemovePlayersButton	= require('./remove_players_button');

const DefaultTeam = React.createClass({
	propTypes: {
		players:						React.PropTypes.array.isRequired,
		positions:						React.PropTypes.array.isRequired,
		handleClickPlayer:				React.PropTypes.func.isRequired,
		handleChangePlayerPosition:		React.PropTypes.func.isRequired,
		handleClickPlayerSub:			React.PropTypes.func.isRequired,
		handleClickRemovePlayerButton:	React.PropTypes.func.isRequired,
		isNonTeamSport:					React.PropTypes.bool.isRequired,
		isRemovePlayerButtonBlock:		React.PropTypes.bool.isRequired,
		error:							React.PropTypes.object.isRequired
	},
	renderTableHead: function() {
		const self = this;

		if(self.props.isNonTeamSport) {
			return (
				<div className="eTeam_player mHead">
					<div className="eTeam_playerItem mNumber">№</div>
					<div className="eTeam_playerItem mName mLong">Name</div>
					<div className="eTeam_playerItem mForm mLong">Form</div>
				</div>
				);
		} else {
			return (
				<div className="eTeam_player mHead">
					<div className="eTeam_playerItem mNumber">№</div>
					<div className="eTeam_playerItem mName">Name</div>
					<div className="eTeam_playerItem mForm">Form</div>
					<div className="eTeam_playerItem mPosition">Position</div>
					<div className="eTeam_playerItem mSub">Sub</div>
				</div>
			);
		}
	},
	_renderPlayers: function () {
		const	self		= this;

		const	players		= self.props.players,
				positions	= self.props.positions;

		let xmlPlayers = [];

		if(this.props.error.isError && this.props.error.text !== 'Please enter team name') {
			xmlPlayers.push(
				<ErrorItem errorText={this.props.error.text}/>
			);
		}

		xmlPlayers = xmlPlayers.concat(players.map((player, index) =>
			<Player	number						= {index + 1}
					key							= {player.id}
					isNonTeamSport				= {self.props.isNonTeamSport}
					player						= {player}
					positions					= {positions}
					handleClickPlayer			= {self.props.handleClickPlayer}
					handleChangePlayerPosition	= {self.props.handleChangePlayerPosition}
					handleClickPlayerSub		= {self.props.handleClickPlayerSub}
			/>
		));

		return xmlPlayers;
	},
	render: function() {
		const self  = this;

		return (
			<div className="eTeamWrapper_teamManagerWrapper">
				<div className="bTeam mDefaultView">
					{self.renderTableHead()}
					<div className="eTeam_playerList">
						{self._renderPlayers()}
					</div>
				</div>
				<RemovePlayersButton	isRemovePlayerButtonBlock		= { this.props.isRemovePlayerButtonBlock }
										handleClickRemovePlayerButton	= { this.props.handleClickRemovePlayerButton }
				/>
			</div>
		);
	}
});

module.exports = DefaultTeam;