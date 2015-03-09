var Team,
    SVG = require('module/ui/svg');

Team = React.createClass({
    mixins: [Morearty.Mixin],
    displayName: 'Team',
    getDefaultState: function () {
        return {
            rival: Immutable.fromJS({
                players: []
            })
        };
    },
    removePlayer: function (playerId) {
        var self = this,
            players = self.getBinding('rival').get('players');

        players.update(function (data) {
            return data.filter(function (model) {
                return model.get('id') !== playerId;
            });
        });
    },
    getPlayers: function () {
        var self = this,
            players = self.getBinding('rival').get('players');

        return players.map(function (player) {
            return <div className="bTeam_ePlayer" key={player.get('id')}>
                <span className="ePlayer_name"><span className="ePlayer_number">{'#'}</span>{player.get('name')}</span>
                <span className="ePlayer_remove" onClick={self.removePlayer.bind(null, player.get('id'))}>
                    <SVG icon="icon_trash" />
                </span>
            </div>
        }).toArray();
    },
    render: function() {
        var self = this,
            rivalBinding = self.getBinding('rival');

        return <div className="bTeam" key={rivalBinding.get('id')}>
            {self.getPlayers()}
        </div>

    }
});

module.exports = Team;