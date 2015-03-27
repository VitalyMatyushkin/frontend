var MultiSelectTeam,
    SVG = require('module/ui/svg'),
    Multiselect = require('module/ui/multiselect/multiselect');

MultiSelectTeam = React.createClass({
    mixins: [Morearty.Mixin],
    displayName: 'MultiSelectTeam',
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            playersBinding = binding.sub('players'),
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
                    gender: binding.get('model.gender') || 'male'
                }
            };


        if (type === 'houses') {
            filter.where.houseId = binding.get('id');
        }

        window.Server.studentsFilter.get({
            filter: filter
        }).then(function (data) {
            data.map(function (player) {
                player.name = player.firstName + ' ' + player.lastName;

                return player.name;
            });

            binding.set('students', Immutable.fromJS(data));
        });
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
    onSelectStudents: function (selected) {
        var self = this,
            binding = self.getDefaultBinding(),
            playersBinding = self.getBinding('players');

        playersBinding.update(function () {
            return binding.get('students').filter(function (student) {
                return selected.indexOf(student.get('id')) !== -1;
            });
        });
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            rivalBinding = self.getBinding('rival'),
            items = binding.get('students').map(function (student) {
                return {
                    id: student.get('id'),
                    text: student.get('name')
                }
            });

        return <div className="bTeamMultiSelect">
            <Multiselect
                binding={binding}
                items={items.toJS()}
                onChange={self.onSelectStudents}
            />
        </div>
    }
});

module.exports = MultiSelectTeam;