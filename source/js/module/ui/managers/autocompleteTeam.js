var AutocompleteTeam,
    SVG = require('module/ui/svg'),
    Autocomplete = require('module/ui/autocomplete/autocomplete');

AutocompleteTeam = React.createClass({
    mixins: [Morearty.Mixin],
    displayName: 'AutocompleteTeam',
    componentWillMount: function () {
        var self = this,
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
            rivalsBinding = self.getDefaultBinding().sub('rivals');

        return rivalsBinding.get().toArray().reduce(function (memo, team) {
            var ids = [];

            if (team.get('players')) {
                ids = team.get('players').map(function (player) {
                    return player.get('id');
                });
            }

            return memo.concat(ids);
        }, Immutable.List());
    },
    /**
     * Service for filtering learner
     * @param schoolId
     * @param learnerName
     * @returns {*}
     */
    serviceLearnersFilter: function (schoolId, learnerName) {
        var self = this,
            binding = self.getDefaultBinding(),
            rivalsType = binding.get('model.rivalsType'),
            filter = {
                where: {
                    schoolId: schoolId,
                    id: {
                        nin: self.getIncludePlayersIds().toJS()
                    },
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


        if (rivalsType === 'houses') {
            filter.where.houseId = binding.get('id');
        } else if (rivalsType === 'classes') {
            filter.where.classId = binding.get('id');
        }

        return window.Server.learnersFilter.get({
            filter: filter
        }).then(function (data) {
            data.map(function (player) {
                player.name = player.firstName + ' ' + player.lastName;

                return player.name;
            });

            return data;
        });
    },
    onSelectLearner: function (selectId, response, model) {
        var self = this,
            playersBinding = self.getBinding('rival').sub('players');

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
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
            rivalBinding = self.getBinding('rival');

        return <div className="bTeamAutocomplete">
            <Autocomplete
                serviceFilter={self.serviceLearnersFilter.bind(null, activeSchoolId)}
                serverField="name"
                placeholderText="enter learner name"
                onSelect={self.onSelectLearner}
                binding={rivalBinding.meta().sub('autocomplete')}
            />
        </div>

    }
});

module.exports = AutocompleteTeam;