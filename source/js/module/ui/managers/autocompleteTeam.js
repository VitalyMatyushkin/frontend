const   React           = require('react'),
        Immutable 	    = require('immutable'),
        Promise         = require('bluebird'),
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
                    limit: 20,
                    include:["user","form"]
                };

            if (type === 'houses') {
                filter.where.houseId = self.getBinding('rival').get('id');
            }

            return window.Server.students
                .get(schoolId, {filter: filter})
                .then((players) => {
                    var filteredPlayers = [];

                    players.forEach((player) => {
                        //filter by gender
                        if(player.user.gender === gender) {
                            player.name = player.user.firstName + ' ' + player.user.lastName;
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
    //    return window.Server.students.get(schoolId, {
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