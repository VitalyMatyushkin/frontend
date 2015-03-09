var Team,
    SVG = require('module/ui/svg');

Team = React.createClass({
    mixins: [Morearty.Mixin],
    propTypes: {
        order: React.PropTypes.number
    },
    displayName: 'Team',
    removePlayer: function (playerId) {
        var self = this,
            players = self.getBinding('rivals').sub([self.props.order, 'players']);

        players.update(function (data) {
            return data.filter(function (model) {
                return model.get('id') !== playerId;
            });
        });
    },
    getPlayers: function () {
        var self = this,
            players = self.getBinding('rivals').get([self.props.order, 'players']);

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
        var self = this;

        return <div className="bTeam">
            {self.getPlayers()}
        </div>

    }
});

module.exports = Team;