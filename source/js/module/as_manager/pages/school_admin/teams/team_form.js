const Immutable      = require('immutable'),
    AutocompleteTeam = require('module/ui/managers/autocompleteTeam'),
    Autocomplete     = require('module/ui/autocomplete2/OldAutocompleteWrapper'),
    Team             = require('module/ui/managers/team'),
    React            = require('react'),
    If               = require('module/ui/if/if'),
    Multiselect      = require('module/ui/multiselect/multiselect'),
    SVG              = require('module/ui/svg');

const TeamForm = React.createClass({
    mixins: [Morearty.Mixin],
    propTypes: {
        title: React.PropTypes.string.isRequired,
        onFormSubmit: React.PropTypes.func
    },
    _getSports: function () {
        const self = this,
            binding = self.getDefaultBinding(),
            sportsBinding = binding.get('sports');

        let sportOptions = '';

        if(sportsBinding) {
            let sports = sportsBinding.toJS();
            sportOptions = sports.map(function (sport) {
                return <Morearty.DOM.option
                    selected={sport.id === binding.get('sportId')}
                    value={sport.id}
                    key={sport.id + '-sport'}
                >{sport.name}</Morearty.DOM.option>
            });
        }

        return sportOptions;
    },
    _changeCompleteSport: function (event) {
        var self = this,
            binding = self.getDefaultBinding(),
            sports = binding.toJS('sports'),
            sportId = event.target.value,
            sportIndex = sports.findIndex(function(model) {
                return model.id === sportId;
            });

        binding
            .atomically()
            .set('sportId',                  Immutable.fromJS(event.target.value))
            .set('sportModel',               Immutable.fromJS(sports[sportIndex]))
            .set('default.model.sportModel', Immutable.fromJS(sports[sportIndex]))
            .set('gender',                   Immutable.fromJS(sports[sportIndex].limits.genders[0]))
            .set('default.model.gender',     Immutable.fromJS(sports[sportIndex].limits.genders[0]))
            .commit();
    },
    _getGenders: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            sportModel = binding.get('sportModel');

        if (sportModel) {
            return sportModel.toJS().limits.genders.map(function (gender, genInd) {
                var names = {
                    male: 'boys',
                    female: 'girls'
                };

                return <label key={genInd} onClick={self._changeCompleteGender}>
                    <Morearty.DOM.input
                        type="radio"
                        key={gender + '-gender'}
                        value={gender}
                        checked={gender === binding.get('gender')}
                    />
                    {names[gender]}
                </label>;
            });
        } else {
            return null;
        }
    },
    _getHouseFilterRadioButton: function () {
        const self = this,
            binding = self.getDefaultBinding();

            return (
                <label onClick={self._changeHouseFilter}>
                    <Morearty.DOM.input
                        type="radio"
                        value={binding.get('isHouseFilterEnable')}
                        checked={binding.get('isHouseFilterEnable')}
                    />
                </label>
            );
    },
    _changeHouseFilter: function() {
        const self = this,
            binding = self.getDefaultBinding();

        binding
            .atomically()
            .set('isHouseFilterEnable', Immutable.fromJS(!binding.get('isHouseFilterEnable')))
            .set('default.model.type',  Immutable.fromJS(!binding.get('isHouseFilterEnable') ? "houses" : null))
            .set('default.players',     Immutable.fromJS([]))
            .set('players',             Immutable.fromJS([]))
            .commit();
    },
    _changeCompleteGender: function (event) {
        var binding = this.getDefaultBinding();

        binding
            .atomically()
            .set('gender',               Immutable.fromJS(event.target.value))
            .set('default.model.gender', Immutable.fromJS(event.target.value))
            .set('default.players',      Immutable.fromJS([]))
            .set('players',              Immutable.fromJS([]))
            .commit();
    },
    _changeCompleteAges: function (selections) {
        var self = this,
            binding = self.getDefaultBinding();

        binding
            .atomically()
            .set('ages',               Immutable.fromJS(selections))
            .set('default.model.ages', Immutable.fromJS(selections))
            .set('default.players',    Immutable.fromJS([]))
            .set('players',            Immutable.fromJS([]))
            .commit();
    },
    _getAgeItems: function() {
        const self  = this,
            availableAges = self.getDefaultBinding().toJS('availableAges');

        let ageItems = [];

        if(availableAges) {
            ageItems = availableAges.map(function (age) {
                return {
                    id: age,
                    text: 'Y' + age
                };
            });
        }

        return ageItems;
    },
    _getSelectedAges: function() {
        const self  = this,
            ages = self.getDefaultBinding().get('ages');

        let result = [];

        if(ages) {
            result = ages;
        }

        return result;
    },
    _serviceHouseFilter: function() {
        const self = this;

        return window.Server.houses.get(self.activeSchoolId);
    },
    _onSelectHouse: function(id, model) {
        const self = this,
            binding = self.getDefaultBinding();

        binding
            .atomically()
            .set('default.model.type',  Immutable.fromJS('houses'))
            .set('rival',               Immutable.fromJS(model))
            .set('isHouseSelected',     Immutable.fromJS(true))
            .set('default.players',     Immutable.fromJS([]))
            .set('players',             Immutable.fromJS([]))
            .commit();
    },
    _isShowTeamManager: function() {
        const self = this,
            binding = self.getDefaultBinding();

        if(!!binding.get('isHouseFilterEnable')) {
            return !!binding.get('ages') && !!binding.get('isHouseSelected');
        } else {
            return !!binding.get('ages')
        }
    },
    render: function() {
        const self  = this,
            binding = self.getDefaultBinding(),
            sportId = binding.get('sportId'),
            autocompleteTeamBinding = {
                default:            binding.sub('default'),
                selectedRivalIndex: binding.sub('selectedRivalIndex'),
                rival:              binding.sub('rival'),
                players:            binding.sub('players')
            },
            teamBinding = {
                default:            binding.sub('default'),
                rivalId:            binding.sub('selectedRivalIndex'),
                players:            binding.sub('players')
            };

        let errorText = '';

        binding.toJS('error') && (errorText = binding.get('error.text'));

        return (
            <div style={{paddingTop: 30}}>
                <div className="bManager mBase">
                    <h2>{self.props.title}</h2>

                    <div className="eManager_base">
                        <div className="eManager_group">
                            {'Event Name'}
                            <Morearty.DOM.input
                                className="eManager_field"
                                type="text"
                                value={binding.get('name')}
                                placeholder={'enter name'}
                                onChange={Morearty.Callback.set(binding.sub('name'))}
                            />
                        </div>
                        <If condition={!!binding.get('name')}>
                            <div className="eManager_group">
                                {'Event Description'}
                                <Morearty.DOM.textarea
                                    className="eManager_field mTextArea"
                                    type="text"
                                    value={binding.get('description')}
                                    placeholder={'enter description'}
                                    onChange={Morearty.Callback.set(binding.sub('description'))}
                                />
                            </div>
                        </If>
                        <If condition={!!binding.get('name')}>
                            <div className="eManager_group">
                                {'Game'}
                                <div className="eManager_select_wrap">
                                    <select
                                        className="eManager_select"
                                        value={sportId}
                                        defaultValue={null}
                                        onChange={self._changeCompleteSport}>
                                        <Morearty.DOM.option
                                            key="nullable-type"
                                            value={null}
                                            selected="selected"
                                            disabled="disabled">not selected</Morearty.DOM.option>
                                        {self._getSports()}
                                    </select>
                                    <SVG classes="selectArrow" icon="icon_dropbox_arrow"/>
                                </div>
                            </div>
                        </If>
                        <If condition={!!binding.get('sportId')}>
                            <div className="eManager_group">
                                {'Gender'}
                                <div className="eManager_radiogroup">
                                    {self._getGenders()}
                                </div>
                            </div>
                        </If>
                        <If condition={!!binding.get('sportId') && !!binding.get('gender')}>
                            <div className="eManager_group">
                                {'Ages'}
                                <Multiselect
                                    binding={binding}
                                    items={self._getAgeItems()}
                                    selections={self._getSelectedAges()}
                                    onChange={self._changeCompleteAges}
                                />
                            </div>
                        </If>
                        <If condition={!!binding.get('sportId')}>
                            <div className="eManager_group">
                                {'Filtered By House'}
                                <div className="eManager_radiogroup">
                                    {self._getHouseFilterRadioButton()}
                                </div>
                            </div>
                        </If>
                        <If condition={!!binding.get('isHouseFilterEnable')}>
                            <div className="eManager_group">
                                {'House'}
                                <div className="eManager_select_wrap">
                                    <Autocomplete
                                        serviceFilter={self._serviceHouseFilter}
                                        serverField="name"
                                        placeholderText={'Select House'}
                                        onSelect={self._onSelectHouse}
                                        binding={binding.sub('houses')}
                                    />
                                </div>
                            </div>
                        </If>
                        <If condition={!!binding.get('ages')}>
                            <div>
                                <div className="eManager_group">
                                    <div className ="eHouseForm">
                                        <AutocompleteTeam binding={autocompleteTeamBinding}/>
                                    </div>
                                </div>
                                <div className="eManager_group">
                                    <Team binding={teamBinding}/>
                                </div>
                                <div className="eManager_group">
                                    <div className="eTeam_errorBox">
                                        {errorText}
                                    </div>
                                </div>
                                <div className="eManager_group">
                                    <div className="bButton" onClick={self.props.onFormSubmit}>Finish</div>
                                </div>
                            </div>
                        </If>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = TeamForm;