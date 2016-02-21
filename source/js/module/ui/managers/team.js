var Team,
    React        = require('react'),
    SVG          = require('module/ui/svg'),
    Lazy         = require('lazyjs'),
    Immutable 	 = require('immutable');


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
    _onSelectPosition: function(playerId, e) {
        const self = this,
              players = self.getBinding('players').toJS();

        const index = Lazy(players).indexOf(Lazy(players).findWhere({id:playerId}));
        players[index].position = e.target.value;

        self.getBinding('players').set(Immutable.fromJS(players));
    },
    _renderPositionOptions: function() {
        const self = this,
              positions = self.getDefaultBinding().get('model.sportModel.limits.positions').toJS();

        return positions.map((position, i) => {
            return (<option key={i} value={position}>{position}</option>);
        });
    },
    onCheckSub: function(playerId, e) {
        const self = this,
            players = self.getBinding('players').toJS();

        const index = Lazy(players).indexOf(Lazy(players).findWhere({id:playerId}));
        players[index].isSub = e.target.checked;

        self.getBinding('players').set(Immutable.fromJS(players));
    },
    getPlayers: function () {
        const self = this,
              players = self.getBinding('players'),
              positions = self._renderPositionOptions();

        return players.get().map(function (player) {
			return (
                <tr className="bPlayer" key={player.get('id')}>
				    <td className="ePlayer_name">{player.get('user').get('firstName')} {player.get('user').get('lastName')}</td>
                    <td className="ePlayer_form">{player.get('form').get('name')}</td>
                    <td className="ePlayer_position">
                        <select onChange={self._onSelectPosition.bind(self, player.get('id'))}>
                            <option selected="selected" disabled="disabled">Select position</option>
                            {positions}
                        </select>
                    </td>
                    <td className="ePlayer_sub">
                        <input
                            onClick={self.onCheckSub.bind(self, player.get('id'))}
                            type="checkbox"
                        />
                    </td>
                    <td className="ePlayer_remove" onClick={self.removePlayer.bind(null, player.get('id'))}>
					    <SVG icon="icon_cross" />
				    </td>
			    </tr>
            );
        }).toArray();
    },
    render: function() {
        const self = this,
              rivalBinding = self.getBinding('rival').toJS(),
              errorBinding = self.getBinding('error').toJS();

        let errorBox;

        if(errorBinding.isError) {
            errorBox = (
                <div className="eTeam_errorBox">
                    {errorBinding.text}
                </div>
            )
        } else {
            errorBox = (<div className="eTeam_errorBox"></div>)
        }

        return (
                <div className="bTeam" key={rivalBinding.id}>
                    <div className="eTeam_playersTableContainer">
                        <table>
                            <thead>
                            <tr className="bPlayer">
                                <td className="ePlayer_name">Name</td>
                                <td className="ePlayer_form">Form</td>
                                <td className="ePlayer_position">Position</td>
                                <td className="ePlayer_sub">Sub</td>
                                <td className="ePlayer_remove"></td>
                            </tr>
                            </thead>
                            <tbody>
                            {self.getPlayers()}
                            </tbody>
                        </table>
                    </div>
                    {errorBox}
                </div>
        );
    }
});

module.exports = Team;