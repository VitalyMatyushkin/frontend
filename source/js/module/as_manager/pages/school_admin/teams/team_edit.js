const	TeamForm             = require('module/as_manager/pages/school_admin/teams/team_form'),
        React                = require('react'),
        TeamPlayersValidator = require('./helpers/team_players_validator'),
        Immutable            = require('immutable');

const TeamEditPage = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            routingData = globalBinding.sub('routing.parameters').toJS(),
            teamId = routingData.id;

        binding.clear();

        if (teamId) {
            window.Server.team.get(teamId).then(function (data) {
                self.isMounted() && binding.set(Immutable.fromJS(data));


            });

            self.teamId = teamId;
        }
    },
    submitEdit: function(data) {
        var self = this;

        window.Server.team.put(self.teamId, data).then(function() {
            self.isMounted() && (document.location.hash = 'school_admin/teams');
        });
    },
    render: function() {
        const self = this,
            binding = self.getDefaultBinding();

        return (
            <TeamForm title="Edit team" onFormSubmit={self.submitEdit} binding={binding} />
        );
    }
});

module.exports = TeamEditPage;