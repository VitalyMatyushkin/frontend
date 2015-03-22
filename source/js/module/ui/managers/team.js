var Team,
    SVG = require('module/ui/svg');

Team = React.createClass({
    mixins: [Morearty.Mixin],
    displayName: 'Team',
    removePlayer: function (playerId) {
        var self = this,
            players = self.getBinding('players');

        players.update(function (data) {
            return data.filter(function (model) {
                return model.get('id') !== playerId;
            });
        });
    },
    getPlayers: function () {
        var self = this,
            players = self.getBinding('players');

        return players.get().map(function (player) {
			return <div className="bPlayer mMini" key={player.get('id')}>
				<img className="ePlayer_avatar" src={player.get('avatar')} />
				<span className="ePlayer_name">{player.get('firstName')}</span>
				<span className="ePlayer_lastName">{player.get('lastName')}</span>
				<span className="ePlayer_remove" onClick={self.removePlayer.bind(null, player.get('id'))}>
					<SVG icon="icon_trash" />
				</span>
			</div>;
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