const   React                = require('react'),
        classNames           = require('classnames'),
        Team                 = require('./team'),
        TeamPlayersValidator = require('./helpers/team_players_validator'),
        GameField            = require('./gameField'),
        AutocompleteTeam     = require('./autocompleteTeam'),
        Immutable            = require('immutable');

const Manager = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding();

        // Init rival index
        if(self.getBinding('selectedRivalIndex').toJS() === null) {
            self._initRivalIndex();
        }

        self.getBinding('players').sub(0).addListener(() => {
            self._validate(0);
        });

        self.getBinding('players').sub(1).addListener(() => {
            self._validate(1);
        });

        binding.set('students', Immutable.List());

        self._validate(0);
        self._validate(1);
    },
    _validate: function(rivalIndex) {
        var self = this,
            binding = self.getDefaultBinding(),
            errorBinding = self.getBinding('error'),
            limits = {
                maxPlayers: binding.toJS('model.sportModel.limits.maxPlayers'),
                minPlayers: binding.toJS('model.sportModel.limits.minPlayers'),
                maxSubs:    binding.toJS('model.sportModel.limits.maxSubs')
            };

        const result = TeamPlayersValidator.validate(
            self.getBinding('players').toJS(rivalIndex),
            limits
        );

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
    getRivals: function () {
        const self = this,
              selectedRivalIndex = self.getBinding('selectedRivalIndex').toJS(),
              rivalsBinding = self.getBinding('rivals');

        return rivalsBinding.get().map(function (rival, index) {
            var disable = self._isRivalDisable(rival),
				teamClasses = classNames({
					mActive: selectedRivalIndex == index,
					eChooser_item: true,
					mDisable: disable
				});

            return (
                <span className={teamClasses}
                      onClick={!disable ? self.onChooseRival.bind(null, index) : null}>{rival.get('name')}
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
	render: function() {
		const self = this,
            defaultBinding          = self.getDefaultBinding(),
            binding                 = self.getBinding(),
            selectedRivalIndex      = self.getBinding('selectedRivalIndex').toJS(),
            autocompleteTeamBinding = {
                default:  defaultBinding,
                rival:    binding.rivals.sub(selectedRivalIndex),
                players:  binding.players.sub(selectedRivalIndex),
                students: binding.students
            },
            teamBinding = {
                default:  defaultBinding,
                rivalId:  binding.rivals.sub(selectedRivalIndex).sub('id'),
                players:  binding.players.sub(selectedRivalIndex)
             },
            gameFieldBinding = {
                default: defaultBinding.sub('model.sportModel.fieldPic')
            },
            errorText = binding.error.toJS(selectedRivalIndex).text;

            return <div className="eManager_container">
                <div className="eManager_chooser">
                    <div className="bChooser">
                        <span className="eChooser_title">Choose a team:</span>
                        {self.getRivals()}
                    </div>
                    <AutocompleteTeam binding={autocompleteTeamBinding}/>
                </div>
                <div className="eManager_containerTeam">
                    <GameField binding={gameFieldBinding}/>
                    <Team binding={teamBinding}/>
                    <div className="eTeam_errorBox">
                        {errorText}
                    </div>
                </div>
            </div>;
	}
});

module.exports = Manager;
