var AutocompleteTeam,
    SVG = require('module/ui/svg'),
    Promise = require('module/core/promise'),
    Autocomplete = require('module/ui/autocomplete/autocomplete');

AutocompleteTeam = React.createClass({
    mixins: [Morearty.Mixin],
    displayName: 'AutocompleteTeam',
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rivalBinding = self.getBinding('rival');

        rivalBinding
            .meta()
            .atomically()
            .update('autocomplete', function () {
                return Immutable.Map();
            })
            .commit();

        binding.set('_students', Immutable.List());
        self.fetchFullData();
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
    serviceStudentFullData: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            students = binding.toJS('_students'),
            promise = new Promise();

        promise.resolve(students.filter(function (student) {
            return self.getIncludePlayersIds().toJS().indexOf(student.id) === -1;
        }));

        return promise;
    },
    fetchFullData: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            type = binding.get('model.type'),
            ages = binding.get('model.ages'),
            schoolId = binding.get('schoolInfo.id'),
            forms = binding.get('schoolInfo.forms').filter(function (form) {
                return ages.indexOf(parseInt(form.get('age'))) !== -1 || ages.indexOf(String(form.get('age'))) !== -1;
            }),
            filter = {
                where: {
                    schoolId: schoolId,
                    formId: {
                        inq: forms.map(function (form) {
                            return form.get('id');
                        }).toJS()
                    },
                    gender: binding.get('model.gender') || 'male'
                }
            };


        if (type === 'houses') {
            filter.where.houseId = binding.get('id');
        }

        window.Server.students.get(schoolId, {
            filter: filter
        }).then(function (data) {
            data.map(function (player) {
                player.name = player.firstName + ' ' + player.lastName;

                return player.name;
            });

            binding.set('_students', Immutable.fromJS(data));
        });
    },
    /**
     * Service for filtering learner
     * @param schoolId
     * @param learnerName
     * @returns {*}
     */
    serviceLearnersFilter: function (learnerName) {
        var self = this,
            binding = self.getDefaultBinding(),
            type = binding.get('model.type'),
            ages = binding.get('model.ages'),
            schoolId = binding.get('schoolInfo.id'),
            forms = binding.get('schoolInfo.forms').filter(function (form) {
                return ages.indexOf(parseInt(form.get('age'))) !== -1 || ages.indexOf(String(form.get('age'))) !== -1;
            }),
            filter = {
                where: {
                    schoolId: schoolId,
                    id: {
                        nin: self.getIncludePlayersIds().toJS()
                    },
                    formId: {
                        inq: forms.map(function (form) {
                            return form.get('id');
                        }).toJS()
                    },
					gender: binding.get('model.gender') || 'male',
                    or: [
                        {
                            firstName: {
                                like: learnerName,
                                options: 'i'
                            }
                        },
                        {
                            lastName: {
                                like: learnerName,
                                options: 'i'
                            }
                        }
                    ]
                }
            };


        if (type === 'houses') {
            filter.where.houseId = binding.get('id');
        }

        return window.Server.students.get(schoolId, {
            filter: filter
        }).then(function (data) {
            data.map(function (player) {
                player.name = player.firstName + ' ' + player.lastName;

                return player.name;
            });

            return data;
        });
    },
    onSelectStudent: function (selectId, response, model) {
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