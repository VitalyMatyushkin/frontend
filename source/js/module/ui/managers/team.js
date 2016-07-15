const	React		= require('react'),
		SVG			= require('module/ui/svg'),
		Lazy		= require('lazy.js'),
		Immutable	= require('immutable'),
		TeamName	= require('./team_name'),
		Morearty    = require('morearty'),
		classNames	= require('classnames');

const	Team	= React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'Team',
	TEXT: {
		POSITIONS: {
			OPTIONS: {
				NOT_SELECTED: 'Not selected'
			}
		}
	},
	/**
	 * Get CSS class for player item
	 * @param playerId
	 * @returns {*}
	 * @private
	 */
	_getPlayerClass: function(playerId) {
		const	self			= this,
				selectedPlayer	= self._getSelectedPlayer();

		return classNames({
			eTeam_player:	true,
			mSelected:		selectedPlayer !== undefined && selectedPlayer.id === playerId
		});
	},
	/**
	 * Get selected player
	 * @private
	 */
	_getSelectedPlayer: function() {
		const	self	= this,
			binding	= self.getDefaultBinding();

		return binding.toJS('selectedPlayer');
	},
	/**
	 * Select player
	 * @param player
	 * @private
	 */
	_selectPlayer: function(player) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('selectedPlayer', Immutable.fromJS(player));
	},
	/**
	 * Deselect player
	 * @private
	 */
	_deselectPlayer: function() {
		const	self	= this,
			binding	= self.getDefaultBinding();

		binding.set('selectedPlayer', Immutable.fromJS(undefined));
	},
	_onSelectPosition: function(playerId, e) {
		const	self	= this,
				players	= self.getBinding('players').toJS(),
				index	= Lazy(players).indexOf(Lazy(players).findWhere({id:playerId}));

		if(self.TEXT.POSITIONS.OPTIONS.NOT_SELECTED == e.target.value) {
			players[index].position = undefined;
		} else {
			players[index].position = e.target.value;
		}

		self.getBinding('players').set(Immutable.fromJS(players));
	},
	_onCheckSub: function(playerId, e) {
		const	self	= this,
				players	= self.getBinding('players').toJS(),
				index	= Lazy(players).indexOf(Lazy(players).findWhere({id:playerId}));

		players[index].sub = e.target.checked;

		self.getBinding('players').set(Immutable.fromJS(players));
	},
	_onRemovePlayer: function (playerId) {
		const	self			= this,
				players			= self.getBinding('players').toJS(),
				findedPlayer	= Lazy(players).findWhere({id:playerId}),
				index			= Lazy(players).indexOf(findedPlayer);

		players.splice(index, 1);

		self.getBinding('players').set(Immutable.fromJS(players));
		self.props.onRemovePlayer && self.props.onRemovePlayer(findedPlayer);
	},
	_renderPositionOptions: function(player) {
		const	self				= this,
				positions			= self.getDefaultBinding().get('model.sportModel.limits.positions').toJS();
		let		renderedPosition	= [];

		//Add NOT SELECTED option
		//If player doesn't has position - set this option as selected
		if(player.position === undefined) {
			renderedPosition.push(
				<option key={'0_position'} selected="selected">{self.TEXT.POSITIONS.OPTIONS.NOT_SELECTED}</option>
			);
		} else {
			renderedPosition.push(<option key={'0_position'}>Not selected</option>);
		}

		renderedPosition.push(
			positions.map((position, i) => {
				const key = `${i + 1}_position`;

				if(position === player.position) {
					return (<option key={key} value={position} selected="selected">{position}</option>);
				} else {
					return (<option key={key} value={position}>{position}</option>);
				}
			})
		);

		return renderedPosition;
	},
	_renderSubOptions: function(player) {
		const	self	= this;

		if(player.sub) {
			return  (
				<input
					onClick={self._onCheckSub.bind(self, player.id)}
					type="checkbox"
					checked="checked"
				/>
			);
		} else {
			return (
				<input
					onClick={self._onCheckSub.bind(self, player.id)}
					type="checkbox"
				/>
			);

		}
	},
	/**
	 * Check players binding
	 * @returns {boolean}
	 * @private
	 */
	_isPlayersAvailable: function() {
		const	self		= this;

		return self.getBinding('players') !== undefined && self.getBinding('players').toJS() !== undefined;
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
	/**
	 * Handler for click on remove player button
	 * @private
	 */
	_onRemoveButtonClick: function() {
		const	self	= this;

		self._onRemovePlayer(self._getSelectedPlayer().id);
		self._deselectPlayer();
	},
	/**
	 * Handler for click on player
	 * @param player
	 * @private
	 */
	_onPlayerClick: function(player) {
		const	self	= this,
				selectedPlayer = self._getSelectedPlayer();

		if(selectedPlayer !== undefined && selectedPlayer.id === player.id ) {
			self._deselectPlayer();
		} else {
			self._selectPlayer(player);
		}
	},
	/**
	 * Get binding for TeamName element
	 * @returns {*|Binding|Object}
	 * @private
	 */
	_getTeamNameBinding: function() {
		const	self	= this;

		return {
			default:	self.getBinding('teamName')
		};
	},
	render: function() {
		const	self		= this,
				rivalId		= self.getBinding('rivalId').toJS();

		return (
			<div className="eTeamWrapper_teamManagerWrapper">
				<div className="bTeam" key={rivalId}>
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
				<div className="eTeam_removeB2H Companyutton"
					 onClick={self._onRemoveButtonClick}
				>
				</div>
			</div>
		);
	}
});

module.exports = Team;