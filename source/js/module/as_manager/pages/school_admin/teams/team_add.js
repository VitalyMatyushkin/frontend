const TeamForm           = require('module/as_manager/pages/school_admin/teams/team_form'),
    TeamPlayersValidator = require('module/ui/managers/helpers/team_players_validator'),
    Immutable            = require('immutable'),
    React                = require('react');

const TeamAddPage = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        const self = this,
            globalBinding  = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId'),
            binding = self.getDefaultBinding();

        self.activeSchoolId = activeSchoolId;

        binding.set('teamForm', Immutable.fromJS({
            error: {
                isError: false,
                text: ''
            }
        }));
    },
    submitAdd: function() {
        const self = this,
            binding = self.getDefaultBinding();

        self._validate();

        if(!binding.toJS('teamForm.error.isError')) {
            var rivalModel = {
                name:        binding.get('teamForm.name'),
                description: binding.get('teamForm.description'),
                sportId:     binding.get('teamForm.sportId'),
                schoolId:    self.activeSchoolId,
                ages:        binding.get('teamForm.model.ages'),
                gender:      binding.get('teamForm.model.gender')
            };

            window.Server.teams.post(rivalModel).then(function (teamsResult) {
                let players = binding.get('teamForm.players').toJS();

                var i = 0;
                // TODO: fix me
                players.forEach((player) => {
                    window.Server.playersRelation.put(
                        {
                            teamId:    teamsResult.id,
                            studentId: player.id
                        },
                        {
                            position:  player.position,
                            sub:       player.sub ? player.sub : false
                        }
                    ).then(function (playerResult) {
                        i += 1;

                        if (i === players.length) {
                            document.location.hash = '/#school_admin/teams';
                            binding.clear();
                            binding.meta().clear();
                        }
                        return playerResult;  // each then-callback should have explicit return
                    });
                });
                return teamsResult;
            });
        }
    },
    _validate: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            limits = {
                maxPlayers: binding.get('teamForm.default.model.sportModel.limits.maxPlayers'),
                minPlayers: binding.get('teamForm.default.model.sportModel.limits.minPlayers'),
                maxSubs:    binding.get('teamForm.default.model.sportModel.limits.maxSubs')
            };

        const result = TeamPlayersValidator.validate(
            binding.toJS('teamForm.players'),
            limits
        );

        binding.set('teamForm.error',
            Immutable.fromJS(result)
        );
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <TeamForm title="Add new team..." onFormSubmit={self.submitAdd} binding={binding.sub('teamForm')} />
        )
    }
});


module.exports = TeamAddPage;