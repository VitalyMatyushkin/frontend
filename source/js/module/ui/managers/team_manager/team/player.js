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
					eTeam_playerItem:	true,
					mName:				true,
					mLong:				self.props.isNonTeamSport
				}),
				playerFormClass = classNames({
					eTeam_playerItem:	true,
					mForm:				true,
					mLong:				self.props.isNonTeamSport
				});

		return (
			<div	className	= {playerClass}
					onClick		= {self.handlePlayerClick}
			>
				<div className="eTeam_playerItem mNumber">
					{this.props.number}
				</div>
				<div className={playerNameClass} title={`${player.firstName} ${player.lastName}`}>
					{`${player.firstName} ${player.lastName}`}
				</div>
				<div className={playerFormClass}>
					{player.form ? player.form.name : ""}
				</div>
				{self.renderPositions()}
				{self.renderIsCaptain()}
				{self.renderSub()}
			</div>
		);
	}
});

module.exports = Player;