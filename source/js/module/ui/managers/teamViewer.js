const   React               = require('react'),
        MoreartyHelper      = require('module/helpers/morearty_helper'),
        TeamHelper          = require('module/ui/managers/helpers/team_helper'),
        Immutable           = require('immutable'),
        Morearty            = require('morearty');

const TeamViewer = React.createClass({
    mixins: [Morearty.Mixin],
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