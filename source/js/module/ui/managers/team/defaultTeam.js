const	React				= require('react'),
		SVG					= require('module/ui/svg'),
		Morearty            = require('morearty'),
		TeamFunctionalMixin	= require('./teamFunctionalMixin');

const DefaultTeam = React.createClass({
	mixins: [Morearty.Mixin, TeamFunctionalMixin],
	displayName: 'Team',
	/**
	 * Handler for click on remove player button
	 * @private
	 */
	_onRemoveButtonClick: function(playerId) {
		const	self	= this;

		self._onRemovePlayer(playerId);
		self._deselectPlayer();
	},
	_renderPlayers: function () {
		const	self		= this;
		let		xmlPlayers	= [];

		if(self._isPlayersAvailable()) {
			const playersData = self.getBinding('players').toJS();

			xmlPlayers.push(playersData.map(player => {
				return (
					<div	className={self._getPlayerClass(player.id)}
							onClick={self._onPlayerClick.bind(self, player)}
							key={player.id}
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
				<div className="bTeam mDefaultView" key={rivalId}>
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

module.exports = DefaultTeam;