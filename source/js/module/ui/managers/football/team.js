var FootballManager;

FootballManager = React.createClass({
	mixins: [Morearty.Mixin],
    getPlayers: function () {
        var self = this,
            players = self.getDefaultBinding().get('players');

        return players.map(function (player) {
            return <div className="ePlayer">
                <span className="ePlayer_number">{'#'}</span>
                <span className="ePlayer_name">{player.get('name')}</span>
            </div>
        });
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return <div className="eManagerGame_team">
            {self.getPlayers}
		</div>
	}
});

module.exports = FootballManager;
