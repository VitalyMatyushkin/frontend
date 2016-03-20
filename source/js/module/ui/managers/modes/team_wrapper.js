const	React			= require('react'),
		Team			= require('./../team'),
		PlayerChooser	= require('./../player_chooser'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		Lazy			= require('lazyjs'),
		If				= require('module/ui/if/if'),
		Immutable		= require('immutable');

const TeamWrapper = React.createClass({
    mixins: [Morearty.Mixin],
    playersListener: undefined,
    componentWillMount: function () {
        const self = this;

        self._initBinding();
        self._addTeamIdListener();
        self._addPlayersListener();
    },
    _addPlayersListener: function() {
        const self = this,
            binding = self.getDefaultBinding();

        self.playersListener = binding.sub('players').addListener((descriptor) => {
            if(descriptor.getCurrentValue() !== undefined && descriptor.getPreviousValue() !== undefined) {
                const currPlayers = descriptor.getCurrentValue().toJS(),
                    prevPlayers = descriptor.getPreviousValue().toJS();

                if(currPlayers.length > prevPlayers.length) {
                    self._checkRemovedPlayersCache(
                        currPlayers[currPlayers.length - 1]
                    );
                }
            }

            if(!self._isPlayersChanged()) {
                self._setTeamSaveMode('selectedTeam');
            }
        });
    },
    _checkRemovedPlayersCache: function(player) {
        const self = this,
            removedPlayers = self.getDefaultBinding().toJS('removedPlayers');

        let findedRemovedPlayer = Lazy(removedPlayers).findWhere({id: player.id});
        if(findedRemovedPlayer) {
            let players = self.getDefaultBinding().toJS('players');
            players[players.length - 1] = findedRemovedPlayer;
            self.getDefaultBinding().sub('players').withDisabledListener(self.playersListener, () => {
                self.getDefaultBinding().set('players', Immutable.fromJS(players));

                const index = Lazy(removedPlayers).indexOf(findedRemovedPlayer);
                removedPlayers.splice(index, 1);
                self.getDefaultBinding().set('removedPlayers', Immutable.fromJS(removedPlayers));
            });
        }
    },
    /**
     * Set initial data to binding.
     * They are empty objects
     * @private
     */
    _initBinding: function() {
        const self = this,
            binding = self.getDefaultBinding();

        if(!binding.get('isInit')) {
            self._initRivalIndexData();
            self._initPlugObjectData();
            self._initRemovePlayersArray();
            self._initTeamSaveMode();
            self._fillPlugBinding();
            binding.set('isInit', Immutable.fromJS(true));
        }
    },
    _initTeamSaveMode: function() {
        const self = this;

        self._setTeamSaveMode('selectedTeam');
    },
    _setTeamSaveMode: function(mode) {
        const self = this,
            binding = self.getDefaultBinding();

        binding.set('teamsSaveMode', Immutable.fromJS(mode));
    },
    _initRemovePlayersArray: function() {
        const self = this,
            binding = self.getDefaultBinding();

        binding.set('removedPlayers', Immutable.fromJS([]));
    },
    /**
     * Init selected rival index for autocompleteTeam binding
     * In this context(TeamWrapper) we plug this object
     * Need fix autocompleteTeam in future
     * @private
     */
    _initRivalIndexData: function() {
        const self = this,
            binding = self.getDefaultBinding();

        binding.set('selectedRivalIndex', Immutable.fromJS(0));
    },
    /**
     * Init plug object for team and autocomplete team elements
     * @private
     */
    _initPlugObjectData: function() {
        const self = this,
            binding = self.getDefaultBinding();

        binding.set('teamTable', Immutable.fromJS(self._getEmptyPlugObject()));
    },
    /**
     * Set data to plug object
     * @private
     */
    _fillPlugBinding: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            teamId = binding.get('selectedTeamId');
        
        self._changeTeam(teamId);
    },
    _getEmptyPlugObject: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            houseId = binding.get('rival.id');

        //set type to houses if rival isn't empty
        //it means - house vs house event
        //and rival is house
        //in other cases rival is empty
        let type = '';
        if(houseId) {
            type = 'houses';
        }

       return {
            schoolInfo: {},
            players: [],
            model: {
                type: type,
                ages: undefined,
                gender: undefined,
                sportModel: undefined
            }
       };
    },
    /**
     * Add listener for selected team ID
     * @private
     */
    _addTeamIdListener: function() {
        const self = this;

        self.getDefaultBinding().sub('selectedTeamId').addListener((descriptor) => {
            self._changeTeam(descriptor.getCurrentValue());
        });
    },
    /**
     * Change team, that mean:
     * 1)Get team from server.
     * 2)Get new team players.
     * 3)Set new data to binding.
     * These data need for Team and AutocompleteTeam elements.
     * @private
     */
    _changeTeam: function(teamId) {
        const self = this,
            binding = self.getDefaultBinding();

        if(teamId) {
            let players;
            self._getPlayersFromServer(teamId).then((_players) => {
                players = _players;

                return self._getTeamFromServer(teamId);
            }).then((team) => {
                const updatedPlayers = TeamHelper.getPlayers(players, team);
                binding
                    .atomically()
                    .set('teamTable.model.players', Immutable.fromJS(updatedPlayers))
                    .set('teamTable.model.sportModel', Immutable.fromJS(team.sport))
                    .set('teamTable.model.ages', Immutable.fromJS(team.ages))
                    .set('teamTable.model.gender', Immutable.fromJS(team.gender))
                    .set('teamTable.schoolInfo', Immutable.fromJS(team.school))
                    .set('players', Immutable.fromJS(updatedPlayers))
                    .set('prevPlayers', Immutable.fromJS(updatedPlayers))
                    .set('removedPlayers', Immutable.fromJS([]))
                    .commit();
                
                return team;
            });
        } else {
            binding
                .atomically()
                .set('teamTable', Immutable.fromJS(self._getEmptyPlugObject()))
                .set('players', Immutable.fromJS([]))
                .set('prevPlayers', Immutable.fromJS([]))
                .set('removedPlayers', Immutable.fromJS([]))
                .commit();
        }
    },
    /**
     * Get team players from server by team ID
     * @param teamId - team ID
     * @returns {Promise}
     * @private
     */
    _getPlayersFromServer: function(teamId) {
        return window.Server.players.get({
            filter: {
                where: {
                    teamId: teamId
                }
            }
        });
    },
    /**
     * Get team from server by team ID
     * @param teamId - team ID
     * @returns {Promise}
     * @private
     */
    _getTeamFromServer: function(teamId) {
        return window.Server.team.get(teamId, {
            filter: {
                include: [
                    {'players': ['user', 'form']},
                    {'school': ['forms']},
                    'sport'
                ]
            }
        });
    },
    _getTeamBinding: function() {
        const self = this,
            binding = self.getDefaultBinding();

        return {
            default: binding.sub('teamTable'),
            rivalId: binding.sub('rival.id'),
            players: binding.sub('players')
        };
    },
    _getPlayerChooserBinding: function() {
        const self = this,
            binding = self.getDefaultBinding();

        return {
            default:            binding.sub('teamTable'),
            selectedRivalIndex: binding.sub('selectedRivalIndex'),
            rival:              binding.sub('rival'),
            players:            binding.sub('players')
        };
    },
    _onRemovePlayer: function(player) {
        const self = this;

        self.getDefaultBinding().set('removedPlayers', Immutable.fromJS(
            self.getDefaultBinding().get('removedPlayers').push(player)
        ));
    },
    _renderTypeRadioButtons: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            mode = binding.toJS('teamsSaveMode');

        return (
            <div className="eTeamWrapper_modeContainer">
                <div className="eTeamWrapper_modeRadioButtonsContainer">
                    <label onClick={self._onClickTypeRadioButton.bind(self, 'temp')}>
                        <Morearty.DOM.input
                            checked={mode == 'temp'}
                            type="radio"
                        />
                        {'Save as temp team'}
                    </label>
                    <label onClick={self._onClickTypeRadioButton.bind(self, 'new')}>
                        <Morearty.DOM.input
                            type="radio"
                            checked={mode == 'new'}
                        />
                        {'Save as new team'}
                    </label>
                    <label onClick={self._onClickTypeRadioButton.bind(self, 'current')}>
                        <Morearty.DOM.input
                            type="radio"
                            checked={mode == 'current'}
                        />
                        {'Save to selected team'}
                    </label>
                </div>
                <If condition={self._isShowNewTeamNameInput()}>
                    <div className="eForm_fieldInput">
                        <input id={'new-team-name'}
                               type={'text'}
                               placeholder={'Enter new team name'}
                               onChange={self._onChangeNewTeamName}
                               value={binding.toJS('newTeamName')}
                        />
                    </div>
                </If>
                <div className="bButton" onClick={self._onRevertChangesButtonClick}>
                    {'Revert changes'}
                </div>
            </div>
        );
    },
    _isShowNewTeamNameInput: function() {
        const self = this;

        return self.getDefaultBinding().toJS('teamsSaveMode') == 'new';
    },
    _onChangeNewTeamName: function(event) {
        const self = this,
            binding = self.getDefaultBinding();

        binding.set('newTeamName', Immutable.fromJS(event.target.value));
    },
    /**
     * Handler for click to revert changes button
     * Set initial state of selected team as current
     * @private
     */
    _onRevertChangesButtonClick: function() {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set(
            'players',
            binding.get('prevPlayers')
        );
    },
    _onClickTypeRadioButton: function(mode) {
        const self = this;

        self._setTeamSaveMode(mode);
    },
    _isPlayersChanged: function() {
        const self = this;

        return !Immutable.is(self.getDefaultBinding().get('players'), self.getDefaultBinding().get('prevPlayers'));
    },
    _isShowTypeRadioButtons: function() {
        const self = this;

        return self._isPlayersChanged();
    },
    render: function() {
        const self = this,
            teamBinding = self._getTeamBinding(),
            playerChooserBinding = self._getPlayerChooserBinding();

        return (
            <div className="bTeamWrapper mMarginTop">
                <div className="eTeamWrapper_teamManagerWrapper">
                    <Team onRemovePlayer={self._onRemovePlayer} binding={teamBinding}/>
                </div>
                <div className="eTeamWrapper_autocompleteWrapper">
                    <PlayerChooser binding={playerChooserBinding}/>
                </div>
                <div>
                    <If condition={self._isShowTypeRadioButtons()}>
                        {self._renderTypeRadioButtons()}
                    </If>
                </div>
            </div>

        );
    }
});

module.exports = TeamWrapper;