const   React           = require('react'),
        Immutable       = require('immutable'),
        Promise         = require('bluebird'),
        Autocomplete    = require('module/ui/autocomplete2/OldAutocompleteWrapper');

const AutocompleteTeam = React.createClass({
    mixins: [Morearty.Mixin],
    displayName: 'AutocompleteTeam',
    componentWillMount: function () {
        const   self       = this,
                binding      = self.getDefaultBinding(),
                type         = binding.get('model.type'),
                rivalBinding = self.getBinding('rival');

        rivalBinding
            .meta()
            .atomically()
            .update('autocomplete', function () {
                return Immutable.Map();
            })
            .commit();
    },
    /**
     * Get school forms filtered by age
     * @param ages
     * @returns {*}
     * @private
     */
    _getFilteredForms: function(ages) {
        const   self    = this,
                binding = self.getDefaultBinding();

        return binding.get('schoolInfo.forms').filter(function (form) {
            return ages.indexOf(parseInt(form.get('age'))) !== -1 || ages.indexOf(String(form.get('age'))) !== -1;
        });
    },
    serviceStudentFullData: function (searchText) {
        const   self    = this,
                binding = self.getDefaultBinding();

        //TODO fix me
        if(binding.get('schoolInfo.forms')) {
            const   ages        = binding.get('model.ages'),
                    gender      = binding.get('model.gender'),
                    forms       = self._getFilteredForms(ages),
                    type        = binding.get('model.type'),
                    schoolId    = binding.get('schoolInfo.id');

            const filter = {
                        where: {
                            _id: {
                                $nin: self._getSelectedPlayersIds()
                            },
                            formId: {
                                $in: forms.map(form => form.get('id')).toJS()
                            },
                            lastName: {
                                like:       searchText,
                                options:    'i'
                            },
                            gender: gender.toUpperCase()
                        }
                    };

            if (type === 'houses') {
                filter.where.houseId = self.getBinding('rival').get('id');
            }

            return window.Server.schoolStudents.get(schoolId, {filter: filter})
                .then(players => self._preparePlayersModels(players));
        } else {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
    },
    _preparePlayersModels: function(players) {
        const self = this;

        return players.map(player => self._preparePlayerModel(player));
    },
	/**
     * Inject some data to user model.
     * This data need for view.
     * @private
     */
    _preparePlayerModel: function(player) {
        player.userId = player.id;
        player.name = player.firstName + ' ' + player.lastName;
        return player;
    },
	/**
     * Return selected players ids.
     * Selected players mean - players who have already been selected.
     * @private
     */
    _getSelectedPlayersIds: function() {
        const self = this;

        const players = self.getBinding('players').toJS();

        return players.map(player => player.id);
    },
    onSelectStudent: function (selectId, model) {
        const   self            = this,
                playersBinding  = self.getBinding('players');

        if (model) {
            playersBinding.update(function (data) {
                var models,
                    found = data.some(function (m) {
                        return m.get('id') === model.id;
                    });

                if (!found) {
                    models = data.push(Immutable.fromJS(model));
                } else {
                    models = data;
                }

                return models;
            });
        }
    },
    render: function() {
        const   self            = this,
                rivalBinding    = self.getBinding('rival');

        return (
            <div className="bTeamAutocomplete" key={'teamautocomplete-' + rivalBinding.get('id')}>
            <Autocomplete
                serviceFilter={self.serviceStudentFullData}
                serverField="name"
                clearAfterSelect={true}
                placeholderText="enter student name"
                onSelect={self.onSelectStudent}
                binding={rivalBinding.meta().sub('autocomplete')}
            />
            </div>
        );
    }
});

module.exports = AutocompleteTeam;