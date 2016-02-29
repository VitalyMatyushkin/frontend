const   React                = require('react'),
        MoreartyHelper       = require('module/helpers/morearty_helper'),
        TeamHelper           = require('module/ui/managers/helpers/team_helper'),
        Immutable            = require('immutable');

const TeamViewer = React.createClass({
    mixins: [Morearty.Mixin],
    propTypes: {
        onTeamClick: React.PropTypes.func
    },
    componentWillMount: function () {
        const self = this;

        self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

        self._setPlayers();

        self._addTeamIdListener();
    },
    /**
     * Add listener for
     * @private
     */
    _addTeamIdListener: function() {
        const self = this;

        self.getDefaultBinding().sub('selectedTeamId').addListener((descriptor) => {
            self._setPlayers();
        });
    },
    /**
     * Get players from server and set it binding
     * @private
     */
    _setPlayers: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            teamId = binding.toJS('selectedTeamId');

        if(teamId) {
            let players;
            window.Server.players.get({
                filter: {
                    where: {
                        teamId: teamId
                    }
                }
            }).then((_players) => {
                players = _players;

                return window.Server.team.get(teamId,{
                    filter: {
                        include: [
                            {'players': ['user', 'form']}
                        ]
                    }
                });
            }).then((team) => {
                return binding.set('players', Immutable.fromJS(TeamHelper.getPlayers(players, team)));
            });
        }
    },
    /**
     * Render players for selected team
     * @private
     */
    _renderPlayers: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            players = binding.toJS('players');

        let renderedPlayers = [];

        if(players) {
            renderedPlayers = players.map((player) => {
                let sub = '';

                if(player.sub) {
                    sub = 'sub';
                }

                return (
                    <tr key={player.id}>
                        <td className="ePlayer_name">{`${player.user.firstName} ${player.user.lastName}`}</td>
                        <td className="ePlayer_form">{player.form.name}</td>
                        <td className="ePlayer_position">{player.position}</td>
                        <td className="ePlayer_sub">{sub}</td>
                    </tr>
                );
            });
        }

        return renderedPlayers;
    },
    render: function() {
        const self = this;

        return (
            <table>
                <thead>
                <tr className="bPlayer mHead">
                    <td className="ePlayer_name">Player Name</td>
                    <td className="ePlayer_form">Form</td>
                    <td className="ePlayer_position">Position</td>
                    <td className="ePlayer_sub">Sub</td>
                </tr>
                </thead>
                <tbody>
                {self._renderPlayers()}
                </tbody>
            </table>
        );
    }
});

module.exports = TeamViewer;