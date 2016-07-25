const	React		= require('react'),
		Immutable	= require('immutable'),
		Promise		= require('bluebird'),
		Lazy		= require('lazy.js'),
		Morearty    = require('morearty'),
		classNames	= require('classnames');

const	PlayerChooser	= React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const	self	= this;

		self._initBinding();
		self._addListeners();
	},

	/*HELPERS FUNCTIONS*/
	_initBinding: function() {
		const	self	= this;

		self._setPlayersBySearchRequest('');
	},
	_addListeners: function () {
		const	self	= this;

		// If selected team was been changed
		self.getBinding('filter').addListener(() => {
			self._setPlayersBySearchRequest('');
		});

		self.getBinding('teamPlayers').addListener((descriptor) => {
			//if player has been deleted
			if (
				descriptor.getPreviousValue() !== undefined &&
				descriptor.getCurrentValue() !== undefined &&
				descriptor.getPreviousValue().size > descriptor.getCurrentValue().size
			) {
				const	prevPlayersList = descriptor.getPreviousValue().toJS(),
						currPlayersList = descriptor.getCurrentValue().toJS();

				for(let i = 0; i < prevPlayersList.length; i++) {
					let player = prevPlayersList[i];

					if (Lazy(currPlayersList).findWhere({id: player.id}) === undefined) {
						self._addPlayerForSelect(player);
						break;
					};
				}

			}
		});
	},
	/**
	 * Search players by search text and set it to 'playersForSelect' binding
	 * @param searchText
	 * @private
	 */
	_setPlayersBySearchRequest: function(searchText) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self._searchPlayers(searchText).then((players) => {
			binding.set('playersForSelect', Immutable.fromJS(players));
		});
	},
	_getNinUserId: function() {
		const self = this;

		const	otherTeamUsers	= self.getBinding('otherTeamPlayers').toJS(),
				teamPlayers		= self.getBinding('teamPlayers').toJS();

		const players = otherTeamUsers ? teamPlayers.concat(otherTeamUsers) : teamPlayers;

		return players.map(user => user.userId);
	},
	/**
	 * Search players by search text
	 * @param searchText
	 * @private
	 */
	_searchPlayers: function (searchText) {
		const	self			= this;
		let		playersPromise	= undefined;

		if (self._isFilterAvailable()) {
			const filter = self.getBinding('filter').toJS();

			const requestFilter = {
						filter: {
							where: {
								_id: {
									$nin: self._getNinUserId()
								},
								lastName: {
									like:		searchText,
									options:	'i'
								},
								formId: {
									$in: filter.forms.map(form => form.id)
								},
								gender: filter.gender.toUpperCase()
							}
						}
					};

			// if event is house vs house
			if (filter.eventType === 'houses') {
				filter.houseId && (requestFilter.filter.where.houseId = filter.houseId);
			}

			playersPromise = window.Server.schoolStudents.get(filter.schoolId, requestFilter).then(players => {
					return players.map(player => {
						player.name		= `${player.firstName}' '${player.lastName}`;
						player.userId	= player.id;

						return player;
					});
				});
		} else {
			playersPromise = new Promise((resolve) => {
				resolve([]);
			});
		}

		return playersPromise;
	},
	/**
	 * Get player index in selected players array
	 * @private
	 */
	_getPlayerIndex: function(player) {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				playersForSelect	= binding.toJS('playersForSelect');
		let		playerIndex			= undefined;

		for(let i = 0; i < playersForSelect.length; i++) {
			if(playersForSelect[i].id === player.id) {
				playerIndex = i;
				break;
			}
		}

		return playerIndex;
	},
	/**
	 * Check availability of players filter
	 * @returns {boolean}
	 * @private
	 */
	_isFilterAvailable: function() {
		const	self	= this;

		return self.getBinding('filter') && self.getBinding('filter').toJS() !== undefined;
	},
	/**
	 * Add current player to players for selection
	 * @param model
	 * @private
	 */
	_addPlayerForSelect: function(player) {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				playersForSelect	= binding.toJS('playersForSelect');

		if(
			playersForSelect !== undefined &&
			playersForSelect !== null &&
			Lazy(playersForSelect).findWhere({id: player.id}) === undefined
		) {
				playersForSelect.unshift(player);
				binding.set('playersForSelect', Immutable.fromJS(playersForSelect));
		}
	},
	/**
	 * Remove current player from players for selection
	 * @param model
	 * @private
	 */
	_removeFromPlayerForSelect: function(player) {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				playersForSelect	= binding.toJS('playersForSelect'),
				playerIndex			= self._getPlayerIndex(player);

		if(playerIndex !== undefined) {
			playersForSelect.splice(playerIndex, 1);
			binding.set('playersForSelect', playersForSelect);
		}
	},
	/**
	 * Add current player to team players
	 * @param model
	 * @private
	 */
	_addPlayerToTeam: function(player) {
		const	self	= this,
				players	= self.getBinding('teamPlayers').toJS();

		players.push(player);
		self.getBinding('teamPlayers').set(Immutable.fromJS(players));
	},
	/**
	 * Select player
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
	 * Get CSS class for player item
	 * @param playerId
	 * @returns {*}
	 * @private
	 */
	_getPlayerClass: function(playerId) {
		const	self			= this,
				selectedPlayer	= self._getSelectedPlayer();

		return classNames({
			ePlayerChooser_player:	true,
			mSelected:				selectedPlayer !== undefined && selectedPlayer.id === playerId
		});
	},
	/*RENDER FUNCTIONS*/
	/**
	 * Render players for selection container
	 * @returns {XML}
	 * @private
	 */
	_renderPlayerList: function() {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				playersForSelect	= binding.toJS('playersForSelect'),
				players				= self._renderPlayersForSelect(playersForSelect);

		return (
			<div className="ePlayerChooser_playerList">
				{players}
			</div>
		);
	},
	/**
	 * Render players for selection
	 * @param playersForSelectData
	 * @returns {Array}
	 * @private
	 */
	_renderPlayersForSelect: function(playersForSelectData) {
		const	self	= this;
		let		players	= [];

		if(playersForSelectData) {
			playersForSelectData.forEach((player, index) => {
				players.push(
					<div	className={self._getPlayerClass(player.id)}
							onClick={self._onPlayerClick.bind(self, index, player)}
							onDoubleClick={self._onPlayerDoubleClick.bind(self, index, player)}
					>
						<div	className="ePlayerChooser_playerName">
							{`${player.firstName} ${player.lastName}`}
						</div>
						<div	className="ePlayerChooser_playerForm">
							{player.form.name}
						</div>
					</div>
				);
			});
		}

		return players
	},
	/**
	 * Render player search box
	 * @returns {XML}
	 * @private
	 */
	_renderPlayerSearchBox: function() {
		const	self	= this;

		return (
			<div className="ePlayerChooser_playerSearchBox">
				<input
					ref			= "input"
					className	= "ePlayerChooser_playerSearchBoxInput"
					placeholder	= "Enter student name"
					onChange	= {self._onChangePlayerSearchBoxText}
				/>
			</div>
		);
	},
	_renderAddToTeamButton: function() {
		const	self	= this;

		return (
			<div	className="ePlayerChooser_addToTeamButton"
					onClick={self._onAddToTeamButtonClick}
			>
			</div>
		);
	},
	/*HANDLERS*/
	/**
	 * Handler for change search box text
	 * @param event
	 * @private
	 */
	_onChangePlayerSearchBoxText: function(event) {
		const	self	= this;

		self._setPlayersBySearchRequest(event.target.value);
	},
	/**
	 * Handler for click on player from players for selection
	 * @param index
	 * @param model
	 * @private
	 */
	_onPlayerClick: function (index, player) {
		const	self			= this,
				selectedPlayer	= self._getSelectedPlayer();

		if(selectedPlayer !== undefined && selectedPlayer.id === player.id ) {
			self._deselectPlayer();
		} else {
			self._selectPlayer(player);
		}
	},
	_onPlayerDoubleClick: function(index, player) {
		const self = this;

		self._addPlayerToTeam(player);
		self._removeFromPlayerForSelect(player);
	},
	/**
	 * Handler for select button click
	 * @private
	 */
	_onAddToTeamButtonClick: function() {
		const self = this;

		const player = self._getSelectedPlayer();

		if(player) {
			self._addPlayerToTeam(player);
			self._removeFromPlayerForSelect(player);
			self._deselectPlayer();
		}
	},
	render: function() {
		const self = this;

		return (
			<div className="eTeamWrapper_autocompleteWrapper">
				<div className="bPlayerChooser">
					{self._renderPlayerSearchBox()}
					{self._renderPlayerList()}
				</div>
				{self._renderAddToTeamButton()}
			</div>
		);
	}
});

module.exports = PlayerChooser;