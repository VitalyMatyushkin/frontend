const   SVG         = require('module/ui/svg'),
        React       = require('react'),
        ReactDOM    = require('react-dom'),
        Immutable 	= require('immutable'),
        Morearty    = require('morearty'),
        Multiselect = require('module/ui/multiselect/multiselect');

const MultiSelectTeam = React.createClass({
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
                return ages.indexOf(form.get('age')) !== -1;
            }),
            filter = {
                where: {
                    id: {
                        nin: self.getExcludePlayersIds().toJS()
                    },
                    formId: {
                        inq: forms.map(function (form) {
                            return form.get('id');
                        }).toJS()
                    },
                    gender: binding.get('model.gender') || 'male'
                },
                include: ['form', 'house']
            };

        if (type === 'houses') {
            filter.where.houseId = {
                inq: binding.get('rivals').map(function (rival) {
                    return rival.get('id')
                }).toJS()
            };
        }

        window.Server.schoolStudents.get(schoolId, {
            filter: filter
        }).then(function (data) {
            data.map(function (player) {
                player.name = player.firstName + ' ' + player.lastName;

                return player.name;
            });

            self.getBinding('students').set(Immutable.fromJS(data));
        });
    },
    getExcludePlayersIds: function () {
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
            playersBinding = self.getBinding('players');

        selected = selected.reduce(function (memo, studentId) {
            if (memo.indexOf(studentId) === -1) {
                memo.push(studentId);
            }

            return memo;
        }, []);

        playersBinding.update(function () {
            return self.getBinding('students').get().filter(function (student) {
                return selected.indexOf(student.get('id')) !== -1;
            });
        });
    },
    render: function() {
        var self = this,
            binding  = self.getDefaultBinding(),
            order = self.props.order === 0 ? 1 : 0,
            students = self.getBinding('students').get(),
            items = students ? students.filter(function (student, index) {
                var result = true,
                    index;

                if (binding.get('model.type') === 'houses') {
                    result = self.getBinding('rival').get('id') === student.get('houseId');
                } else if (binding.get('model.type') === 'internal') {
                    index = binding.get('players.' + order).findIndex(function (player) {
                        return player.get('id') === student.get('id');
                    });
                    result = index === -1;
                }

                return result;
            }).map(function (student) {
                var formName = student.get('form').get('name'),
                    houseName = student.get('house').get('name');

                return {
                    id: student.get('id'),
                    text: student.get('name') + ' [' + formName + '|' +  houseName + ']'
                }
            }).toJS() : [],
            binding = {
                default: self.getDefaultBinding(),
                students: self.getBinding('students'),
                players: self.getBinding('players'),
                rival: self.getBinding('rival')
            },
            selections = self.getBinding('players').get().map(function (player) {
                return player.get('id');
            }).toJS();

        return <div className="bTeamMultiSelect">
            <Multiselect
                binding={binding}
                key={'select-students-to-team-' + self.getBinding('rival').get('name').split(' ').join('-')}
                items={items}
                selections={selections}
                onChange={self.onSelectStudents}
            />
        </div>
    }
});

module.exports = MultiSelectTeam;