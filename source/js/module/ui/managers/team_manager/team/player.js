const	React					= require('react'),
		PlayerPositionsColumn	= require('./playerPositionsColumn'),
		PlayerSubColumn			= require('./playerSubColumn'),
		PlayerIsCaptainColumn	= require('./playerIsCaptainColumn'),
		classNames				= require('classnames');

const Player = React.createClass({
	propTypes: {
		isNonTeamSport:				React.PropTypes.bool.isRequired,
		number:						React.PropTypes.number.isRequired,
		player:						React.PropTypes.object.isRequired,
		positions:					React.PropTypes.array,
		handleClickPlayer:			React.PropTypes.func.isRequired,
		handleChangePlayerPosition:	React.PropTypes.func.isRequired,
		handleClickPlayerSub:		React.PropTypes.func.isRequired,
		handleClickPlayerIsCaptain:	React.PropTypes.func.isRequired
	},
	getInitialState: function(){
		return {
			isSelected: false
		};
	},
	handlePlayerClick: function() {
		const self = this;

		self.setState({
			isSelected: !self.state.isSelected
		});
		self.props.handleClickPlayer(self.props.player.id);
	},
	handleChangePlayerPosition: function(newPositionId) {
		const self = this;

		self.props.handleChangePlayerPosition(self.props.player.id, newPositionId);
	},
	handleClickPlayerSub: function(isSub) {
		const self = this;

		self.props.handleClickPlayerSub(self.props.player.id, isSub);
	},
	handleClickPlayerIsCaptain: function(isCaptain) {
		const self = this;

		self.props.handleClickPlayerIsCaptain(self.props.player.id, isCaptain);
	},
	renderPositions: function() {
		const self = this;

		if(self.props.isNonTeamSport) {
			return null;
		} else {
			return (
				<PlayerPositionsColumn	positions					= {self.props.positions}
										selectedPositionId			= {self.props.player.positionId}
										handleChangePlayerPosition	= {self.handleChangePlayerPosition}
				/>
			);
		}
	},
	renderIsCaptain: function() {
		const self = this;

		if(self.props.isNonTeamSport) {
			return null;
		} else {
			return (
				<PlayerIsCaptainColumn	isChecked					= {self.props.player.isCaptain}
										handleClickPlayerIsCaptain	= {self.handleClickPlayerIsCaptain}
				/>
			);
		}
	},
	renderSub: function() {
		const self = this;

		if(self.props.isNonTeamSport) {
			return null;
		} else {
			return (
				<PlayerSubColumn	isChecked				= {self.props.player.sub}
									handleClickPlayerSub	= {self.handleClickPlayerSub}
				/>
			);
		}
	},
	render: function() {
		const self = this;

		const player = self.props.player;

		const	playerClass	= classNames({
					eTeam_player:	true,
					mSelected:		self.state.isSelected
				}),
				playerNameClass = classNames({
					'col-md-3': !self.props.isNonTeamSport,
					'col-md-8': self.props.isNonTeamSport
				}),
				playerFormClass = classNames({
					'col-md-1': !self.props.isNonTeamSport,
					'col-md-4': self.props.isNonTeamSport
				});

		return (
			<tr
				className	= { playerClass }
				onClick		= { self.handlePlayerClick }
			>
				<th scope="row">
					{ this.props.number }
				</th>
				<td className = { playerNameClass } >
					{`${player.firstName} ${player.lastName}`}
				</td>
				<td className = { playerFormClass } >
					{ player.form ? player.form.name : ""}
				</td>
				{ self.renderPositions() }
				{ self.renderIsCaptain() }
				{ self.renderSub() }
			</tr>
		);
	}
});

module.exports = Player;