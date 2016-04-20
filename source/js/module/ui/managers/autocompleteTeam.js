const   React           = require('react'),
        Immutable 	    = require('immutable'),
        Promise         = require('bluebird'),
        Lazy            = require('lazyjs'),
        Autocomplete    = require('module/ui/autocomplete2/OldAutocompleteWrapper');

const AutocompleteTeam = React.createClass({
    mixins: [Morearty.Mixin],
    displayName: 'AutocompleteTeam',
    componentWillMount: function () {
        const self       = this,
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
    getIncludePlayersIds: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            players = binding.sub('players');

        return players.get().reduce(function (memo, teamPlayers) {
            var ids = teamPlayers.map(function (player) {
                return player.get('id');
            });

            return memo.concat(ids);
        }, Immutable.List());
    },
    /**
     * Get school forms filtered by age
     * @param ages
     * @returns {*}
     * @private
     */
    _getFilteredForms: function(ages) {
        const self = this,
            binding = self.getDefaultBinding();

        return binding.get('schoolInfo.forms').filter(function (form) {
            return ages.indexOf(parseInt(form.get('age'))) !== -1 || ages.indexOf(String(form.get('age'))) !== -1;
        });
    },
    serviceStudentFullData: function (searchText) {
        const self = this,
            binding = self.getDefaultBinding();

        //TODO fix me
        if(binding.get('schoolInfo.forms')) {
            const ages = binding.get('model.ages'),
                gender = binding.get('model.gender'),
                forms = self._getFilteredForms(ages),
                type = binding.get('model.type'),
                schoolId = binding.get('schoolInfo.id'),

                filter = {
                    where: {
                        formId: {
                            inq: forms.map(function (form) {
                                return form.get('id');
                            }).toJS()
                        },
                        or: [
                                {
                                    'userInfo.lastName': {
                                        like:       searchText,
                                        options:    'i'
                                    }
                                },
                                {
                                    'userInfo.firstName': {
                                        like:       searchText,
                                        options:    'i'
                                    }
                                }
                            ]
                    },
                    include:["user","form"]
                };

            if (type === 'houses') {
                filter.where.houseId = self.getBinding('rival').get('id');
            }

            let players;

            return window.Server.schoolStudents.get(schoolId, {filter: filter})
                .then(_players => {
                    players = _players;

                    return window.Server.schoolForms.get(schoolId);
                })
                .then(forms => {
                    let playersWithForms = self.injectFormsToPlayers(players, forms);

                    var filteredPlayers = [];

                    playersWithForms.forEach((player) => {
                        //filter by gender
                        if(player.gender === gender.toUpperCase()) {
                            player.name = player.firstName + ' ' + player.lastName;
                            filteredPlayers.push(player);
                        }
                    });

                    return filteredPlayers;
                });
        } else {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
    },
	/**
     * Method inject form data to each player
     * Method required until on the server becomes available "include" functional
     */
    injectFormsToPlayers: function(players, forms) {
        const playersWithForms = [];

        players.forEach(player => {
            const form = Lazy(forms).findWhere( { id: player.formId } );
            const tempPlayer = Object.assign({}, player);

            tempPlayer.form = form;

            playersWithForms.push(tempPlayer);
        });

        return playersWithForms;
    },
    /**
     * Service for filtering learner
     * @param schoolId
     * @param learnerName
     * @returns {*}
     */
    //serviceLearnersFilter: function (learnerName) {
    //    var self = this,
    //        binding = self.getDefaultBinding(),
    //        type = binding.get('model.type'),
    //        ages = binding.get('model.ages'),
    //        schoolId = binding.get('schoolInfo.id'),
    //        forms = binding.get('schoolInfo.forms').filter(function (form) {
    //            return ages.indexOf(parseInt(form.get('age'))) !== -1 || ages.indexOf(String(form.get('age'))) !== -1;
    //        }),
    //        filter = {
    //            where: {
    //                schoolId: schoolId,
    //                id: {
    //                    nin: self.getIncludePlayersIds().toJS()
    //                },
    //                formId: {
    //                    inq: forms.map(function (form) {
    //                        return form.get('id');
    //                    }).toJS()
    //                },
		//			gender: binding.get('model.gender') || 'male',
    //                or: [
    //                    {
    //                        firstName: {
    //                            like: learnerName,
    //                            options: 'i'
    //                        }
    //                    },
    //                    {
    //                        lastName: {
    //                            like: learnerName,
    //                            options: 'i'
    //                        }
    //                    }
    //                ]
    //            }
    //        };
    //
    //
    //    if (type === 'houses') {
    //        filter.where.houseId = binding.get('id');
    //    }
    //
    //    return window.Server.schoolStudents.get(schoolId, {
    //        filter: filter
    //    }).then(function (data) {
    //        data.map(function (player) {
    //            player.name = player.firstName + ' ' + player.lastName;
    //
    //            return player.name;
    //        });
    //
    //        return data;
    //    });
    //},
    onSelectStudent: function (selectId, model) {
        var self = this,
            playersBinding = self.getBinding('players');

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
        var self = this,
            rivalBinding = self.getBinding('rival');

        return <div className="bTeamAutocomplete" key={'teamautocomplete-' + rivalBinding.get('id')}>
            <Autocomplete
                serviceFilter={self.serviceStudentFullData}
                serverField="name"
                clearAfterSelect={true}
                placeholderText="enter student name"
                onSelect={self.onSelectStudent}
                binding={rivalBinding.meta().sub('autocomplete')}
            />
        </div>
    }
});

module.exports = AutocompleteTeam;