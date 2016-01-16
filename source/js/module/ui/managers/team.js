var Team,
    React = require('react'),
    ReactDOM = require('reactDom'),
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
				<span className="ePlayer_gender">{player.get('user').get('gender').toUpperCase()}</span>
				<span className="ePlayer_name">{player.get('user').get('firstName')} {player.get('user').get('lastName')}</span>
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