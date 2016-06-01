const	Lazy				= require('lazyjs'),
		Immutable			= require('immutable'),
		classNames			= require('classnames');

const TeamFunctionalMixin = {
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
	}
};

module.exports = TeamFunctionalMixin;