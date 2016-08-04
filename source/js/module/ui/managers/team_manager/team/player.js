const	React					= require('react'),
		PlayerPositionsColumn	= require('./playerPositionsColumn'),
		PlayerSubColumn			= require('./playerSubColumn'),
		classNames				= require('classnames');

const Player = React.createClass({
	propTypes: {
		player:						React.PropTypes.object.isRequired,
		positions:					React.PropTypes.array,
		handleClickPlayer:			React.PropTypes.func.isRequired,
		handleChangePlayerPosition:	React.PropTypes.func.isRequired,
		handleClickPlayerSub:		React.PropTypes.func.isRequired
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
	render: function() {
		const self = this;

		const player = self.props.player;

		const playerClass = classNames({
			eTeam_player:	true,
			mSelected:		self.state.isSelected
		});

		return (
			<div	className={playerClass}
					onClick={self.handlePlayerClick}
			>
				<div className="eTeam_playerItem mName">
					{`${player.firstName} ${player.lastName}`}
				</div>
				<div className="eTeam_playerItem mForm">
					{player.form.name}
				</div>
				<PlayerPositionsColumn	positions=					{self.props.positions}
										selectedPositionId=			{player.positionId}
										handleChangePlayerPosition=	{self.handleChangePlayerPosition}
				/>
				<PlayerSubColumn	isChecked=				{self.props.player.sub}
									handleClickPlayerSub=	{self.handleClickPlayerSub}
				/>
			</div>
		);
	}
});

module.exports = Player;