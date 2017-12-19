const	React	= require('react'),

		Player				= require('./player'),
		ErrorItem			= require('./errorItem'),
		RemovePlayersButton	= require('./remove_players_button');

const	TeamStyle			= require('../../../../../../styles/ui/mangers/b_team.scss');

const DefaultTeam = React.createClass({
	propTypes: {
		players:						React.PropTypes.array.isRequired,
		positions:						React.PropTypes.array.isRequired,
		handleClickPlayer:				React.PropTypes.func.isRequired,
		handleChangePlayerPosition:		React.PropTypes.func.isRequired,
		handleClickPlayerSub:			React.PropTypes.func.isRequired,
		handleClickRemovePlayerButton:	React.PropTypes.func.isRequired,
		handleClickPlayerIsCaptain:		React.PropTypes.func.isRequired,
		isNonTeamSport:					React.PropTypes.bool.isRequired,
		isRemovePlayerButtonBlock:		React.PropTypes.bool.isRequired,
		error:							React.PropTypes.object.isRequired
	},
	renderTableHead: function() {
		const self = this;

		if(self.props.isNonTeamSport) {
			return (
				<thead>
					<tr>
						<th>#</th>
						<th className='col-md-8'>Name</th>
						<th className='col-md-4'>Form</th>
					</tr>
				</thead>
			);
		} else {
			return (
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Form</th>
						<th>Position</th>
						<th>Captain</th>
						<th>Sub</th>
					</tr>
				</thead>
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
			<Player
				number						= {index + 1}
				key							= {player.id}
				isNonTeamSport				= {self.props.isNonTeamSport}
				player						= {player}
				positions					= {positions}
				handleClickPlayer			= {self.props.handleClickPlayer}
				handleChangePlayerPosition	= {self.props.handleChangePlayerPosition}
				handleClickPlayerSub		= {self.props.handleClickPlayerSub}
				handleClickPlayerIsCaptain	= {self.props.handleClickPlayerIsCaptain}
			/>
		));

		return xmlPlayers;
	},
	render: function() {
		const self  = this;

		return (
			<div className="eTeamWrapper_teamManagerWrapper">
				<div className="bTeam mDefaultView">
					<table className="table table-hover">
						{ self.renderTableHead() }
						<tbody>
							{ self._renderPlayers() }
						</tbody>
					</table>
				</div>
				<RemovePlayersButton	isRemovePlayerButtonBlock		= { this.props.isRemovePlayerButtonBlock }
										handleClickRemovePlayerButton	= { this.props.handleClickRemovePlayerButton }
				/>
			</div>
		);
	}
});

module.exports = DefaultTeam;