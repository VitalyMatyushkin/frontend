const	React				= require('react'),
		TeamName			= require('./../team_name'),
		TeamFunctionalMixin	= require('./teamFunctionalMixin');

const SkypeStyleTeam = React.createClass({
	mixins: [Morearty.Mixin, TeamFunctionalMixin],
	displayName: 'Team',
	/*HANDLERS*/
	/**
	 * Handler for click on remove player button
	 * @private
	 */
	_onRemoveButtonClick: function() {
		const	self	= this;

		const selectedPlayer = self._getSelectedPlayer();

		if(selectedPlayer) {
			self._onRemovePlayer(selectedPlayer.id);
			self._deselectPlayer();
		}
	},
	/*RENDER FUNCTIONS*/
	_renderPlayers: function () {
		const	self		= this;
		let		xmlPlayers	= [];

		if(self._isPlayersAvailable()) {
			const playersData = self.getBinding('players').toJS();

			xmlPlayers.push(playersData.map(player => {
				return (
					<div	className=		{self._getPlayerClass(player.id)}
							onClick=		{self._onPlayerClick.bind(self, player)}
							onDoubleClick=	{self._onPlayerDoubleClick.bind(self, player)}
							key=			{player.id}
					>
						<div className="eTeam_playerItem mName">
							{`${player.firstName} ${player.lastName}`}
						</div>
						<div className="eTeam_playerItem mForm">
							{player.form.name}
						</div>
						<div className="eTeam_playerItem mSelector mPosition">
							<select className="eTeam_positionSelector"
									onChange={self._onSelectPosition.bind(self, player.id)}
							>
								{self._renderPositionOptions(player)}
							</select>
						</div>
						<div className="eTeam_playerItem mSub">
							{self._renderSubOptions(player)}
						</div>
					</div>
				);
			}));
		}

		return xmlPlayers;
	},
	render: function() {
		const	self		= this,
			rivalId		= self.getBinding('rivalId').toJS();

		return (
			<div className="eTeamWrapper_teamManagerWrapper">
				<div className="bTeam mSkypeStyleView" key={rivalId}>
					<TeamName binding={self._getTeamNameBinding()}/>
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
				<div className="eTeam_removeButton"
					 onClick={self._onRemoveButtonClick}
				>
				</div>
			</div>
		);
	}
});

module.exports = SkypeStyleTeam;