const   React                = require('react'),
        classNames           = require('classnames'),
        Team                 = require('./team'),
        TeamPlayersValidator = require('./helpers/team_players_validator'),
        GameField            = require('./gameField'),
        AutocompleteTeam     = require('./autocompleteTeam'),
        If                   = require('module/ui/if/if'),
        TeamModeView         = require('./modes/team_mode_view'),
        Immutable            = require('immutable');

const Manager = React.createClass({
	mixins: [Morearty.Mixin],
    //mode of view team manager
    //teams - select from already formed teams
    //temp - create temp team
    MODE_TYPES: {
        TEAMS: {
            name: 'teams'
        },
        TEMP: {
            name: 'temp'
        }
    },
    componentWillMount: function () {
        var self = this;

        self._initBinding();

        self._addListeners();

        self._validate(0);
        self._validate(1);
    },
    /**
     * Init main binding
     * @private
     */
    _initBinding: function() {
        var self = this,
            defaultBinding = self.getDefaultBinding(),
            binding = self.getBinding();

        // Init rival index if need
        if(binding.selectedRivalIndex.toJS() === null) {
            self._initRivalIndex();
        }
        defaultBinding
            .atomically()
            .set('students', Immutable.List())
            .set('mode', Immutable.fromJS([
                self.MODE_TYPES.TEAMS.name,
                self.MODE_TYPES.TEAMS.name
            ]))
            .set('teamModeView', Immutable.fromJS(
                {
                    selectedRivalIndex: defaultBinding.get('selectedRivalIndex'),
                    teamTable: [
                        {
                            selectedTeamId: undefined,
                            exceptionTeamId: undefined
                        },
                        {
                            selectedTeamId: undefined,
                            exceptionTeamId: undefined
                        }
                    ],
                    teamWrapper: [
                        {
                            selectedTeamId: undefined
                        },
                        {
                            selectedTeamId: undefined
                        }
                    ]
                }
            ))
            .commit();
    },
    /**
     * Add listeners on binding
     * @private
     */
    _addListeners: function() {
        var self = this,
            defaultBinding = self.getDefaultBinding(),
            binding = self.getBinding();

        defaultBinding.sub('selectedRivalIndex').addListener(() => {
            defaultBinding.set('teamModeView.selectedRivalIndex', defaultBinding.toJS('selectedRivalIndex'))
        });
        defaultBinding.sub('mode').addListener(() => {
            self._validate(defaultBinding.toJS('selectedRivalIndex'));
        });
        binding.players.sub(0).addListener(() => {
            self._validate(0);
        });
        binding.players.sub(1).addListener(() => {
            self._validate(1);
        });
        defaultBinding.sub('teamModeView.teamWrapper.0.players').addListener(() => {
            self._validate(0);
        });
        defaultBinding.sub('teamModeView.teamWrapper.1.players').addListener(() => {
            self._validate(1);
        });
    },
    _validate: function(rivalIndex) {
        const self = this,
            binding = self.getDefaultBinding(),
            errorBinding = self.getBinding('error'),
            mode = self.getDefaultBinding().toJS(`mode.${rivalIndex}`),
            limits = {
                maxPlayers: binding.toJS('model.sportModel.limits.maxPlayers'),
                minPlayers: binding.toJS('model.sportModel.limits.minPlayers'),
                maxSubs:    binding.toJS('model.sportModel.limits.maxSubs')
            };

        let result;
        switch (mode) {
            case 'temp':
                result = TeamPlayersValidator.validate(
                    self.getBinding('players').toJS(rivalIndex),
                    limits
                );

                break;
            case 'teams':
                if(binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.selectedTeamId`) === undefined) {
                    result = {
                        isError: true,
                        text: 'Please select team'
                    }
                } else {
                    result = TeamPlayersValidator.validate(
                        binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.players`),
                        limits
                    );
                }
                break;
        }

        errorBinding.sub(rivalIndex).set(
            Immutable.fromJS(result)
        );
    },
    _initRivalIndex: function() {
        const self = this,
            eventType  = self.getDefaultBinding().toJS('model.type');

        let currentRivalIndex;

        if(eventType === 'inter-schools') {
            let activeSchoolId = self.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
                rivals = self.getBinding().rivals.toJS();

            for(let rivalIndex in rivals) {
                if(rivals[rivalIndex].id === activeSchoolId) {
                    currentRivalIndex = rivalIndex;
                    break;
                }
            }
        } else {
            currentRivalIndex = 0;
        }

        self.getBinding('selectedRivalIndex').set(Immutable.fromJS(currentRivalIndex));
    },
    showError: function() {
        alert("Bad players count");
    },
    onChooseRival: function (index) {
        var self = this;

        self.getBinding('selectedRivalIndex').set(Immutable.fromJS(index));
    },
    _getRivals: function () {
        const self = this,
              selectedRivalIndex = self.getBinding('selectedRivalIndex').toJS(),
              rivalsBinding = self.getBinding('rivals');

        return rivalsBinding.get().map(function (rival, index) {
            const disable = self._isRivalDisable(rival),
				teamClasses = classNames({
					mActive: selectedRivalIndex == index,
					eChooser_item: true,
					mDisable: disable
				}),
                eventType  = self.getDefaultBinding().toJS('model.type');

            let text = '';

            switch (eventType) {
                case 'houses':
                case 'inter-schools':
                    text = rival.get('name');
                    break;
                case 'internal':
                    if(index == 0) {
                        text = "First team";
                    } else {
                        text = "Second team";
                    }
                    break;
            }

            return (
                <span className={teamClasses}
                      onClick={!disable ? self.onChooseRival.bind(null, index) : null}>{text}
                </span>
            );
        }).toArray();
    },
    _isRivalDisable: function(rival) {
        const self = this,
              binding = self.getDefaultBinding();

        return (
            rival.get('id') !== binding.get('schoolInfo.id') &&
            binding.get('model.type') === 'inter-schools'
        );
    },
    _getMode: function(rivalIndex) {
        const self = this,
            binding = self.getDefaultBinding();

        return binding.get(`mode.${rivalIndex}`);
    },
    _onClickTeamMode: function(modeName) {
        const self = this;

        self.getDefaultBinding().set(
            `mode.${self.getBinding('selectedRivalIndex').toJS()}`,
            Immutable.fromJS(modeName)
        );
    },
    _getModeChooser: function(rivalIndex) {
        const self = this;

        let chooser = [];

        for(let mode in self.MODE_TYPES) {
            const teamClasses = classNames({
                    eChooser_item: true,
                    mActive: self.MODE_TYPES[mode].name === self._getMode(rivalIndex)
                }),
                text = self._getModeChooserText(self.MODE_TYPES[mode].name);

            chooser.push(
                <span className={teamClasses}
                      key={`${self.MODE_TYPES[mode].name}`}
                      onClick={self._onClickTeamMode.bind(self, self.MODE_TYPES[mode].name)}>{text}</span>
            );
        };

        return chooser;
    },
    _getModeChooserText: function(mode) {
        let text = '';

        if(mode == 'temp') {
            text = 'Create temporary team';
        } else if(mode == 'teams') {
            text = 'Select from created teams'
        }

        return text;
    },
	render: function() {
		const self = this,
            defaultBinding          = self.getDefaultBinding(),
            binding                 = self.getBinding(),
            selectedRivalIndex      = self.getBinding('selectedRivalIndex').toJS(),
            autocompleteTeamBinding = {
                default:            defaultBinding,
                selectedRivalIndex: self.getBinding('selectedRivalIndex'),
                rival:              binding.rivals.sub(selectedRivalIndex),
                players:            binding.players.sub(selectedRivalIndex)
            },
            teamBinding = {
                default:  defaultBinding,
                rivalId:  binding.rivals.sub(selectedRivalIndex).sub('id'),
                players:  binding.players.sub(selectedRivalIndex)
             },
            gameFieldBinding = {
                default: defaultBinding.sub('model.sportModel.fieldPic')
            },
            teamModeViewBinding = {
                default: defaultBinding.sub(`teamModeView`),
                model: defaultBinding.sub('model'),
                rivals: defaultBinding.sub('rivals')
            },
            errorText = binding.error.toJS(selectedRivalIndex).text;

            return <div className="eManager_container">
                <div className="eManager_chooser">
                    <div className="bChooser">
                        {self._getModeChooser(selectedRivalIndex)}
                    </div>
                </div>
                <div className="eManager_chooser">
                    <div className="bChooserRival">
                        {self._getRivals()}
                    </div>
                </div>
                <If condition={self._getMode(selectedRivalIndex) === 'teams'}>
                    <div className="eManager_containerTeam">
                        <div className="eManager_gameFieldContainer">
                            <GameField binding={gameFieldBinding}/>
                        </div>
                        <div className="eManager_teamModeViewContainer">
                            <TeamModeView binding={teamModeViewBinding}/>
                        </div>
                    </div>
                </If>
                <If condition={self._getMode(selectedRivalIndex) === 'temp'}>
                    <div className="eManager_chooser">
                        <div className="eManager_plug"></div>
                        <AutocompleteTeam binding={autocompleteTeamBinding}/>
                    </div>
                </If>
                <If condition={self._getMode(selectedRivalIndex) === 'temp'}>
                    <div className="eManager_containerTeam">
                        <GameField binding={gameFieldBinding}/>
                        <div className="eManager_managerTeamContainer">
                            <Team binding={teamBinding}/>
                        </div>
                    </div>
                </If>
                <div className="eTeam_errorBox">
                    {errorText}
                </div>
            </div>;
	}
});

module.exports = Manager;
