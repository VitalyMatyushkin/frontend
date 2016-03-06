var Team,
    React        = require('react'),
    SVG          = require('module/ui/svg'),
    Lazy         = require('lazyjs'),
    Immutable 	 = require('immutable');

Team = React.createClass({
    mixins: [Morearty.Mixin],
    displayName: 'Team',
    TEXT: {
        POSITIONS: {
            OPTIONS: {
                NOT_SELECTED: 'Not selected'
            }
        }
    },
    _onSelectPosition: function(playerId, e) {
        const self = this,
              players = self.getBinding('players').toJS();

        const index = Lazy(players).indexOf(Lazy(players).findWhere({id:playerId}));
        if(self.TEXT.POSITIONS.OPTIONS.NOT_SELECTED == e.target.value) {
            players[index].position = undefined;
        } else {
            players[index].position = e.target.value;
        }

        self.getBinding('players').set(Immutable.fromJS(players));
    },
    _onCheckSub: function(playerId, e) {
        const self = this,
            players = self.getBinding('players').toJS();

        const index = Lazy(players).indexOf(Lazy(players).findWhere({id:playerId}));
        players[index].sub = e.target.checked;

        self.getBinding('players').set(Immutable.fromJS(players));
    },
    _onRemovePlayer: function (playerId) {
        const self = this,
            players = self.getBinding('players').toJS();

        const findedPlayer = Lazy(players).findWhere({id:playerId}),
            index = Lazy(players).indexOf(findedPlayer);

        players.splice(index, 1);

        self.getBinding('players').set(Immutable.fromJS(players));
        self.props.onRemovePlayer && self.props.onRemovePlayer(findedPlayer);
    },
    _renderPositionOptions: function(player) {
        const self = this,
              positions = self.getDefaultBinding().get('model.sportModel.limits.positions').toJS();

        let renderedPosition = [];

        //Add NOT SELECTED option
        //If player doesn't has position - set this option as selected
        if(player.position === undefined) {
            renderedPosition.push(
                <option key={'0_position'} selected="selected">{self.TEXT.POSITIONS.OPTIONS.NOT_SELECTED}</option>
            );
        } else {
            renderedPosition.push(<option key={'0_position'}>Not selected</option>);
        }

        renderedPosition.push(
            positions.map((position, i) => {
                const key = `${i + 1}_position`;

                if(position === player.position) {
                    return (<option key={key} value={position} selected="selected">{position}</option>);
                } else {
                    return (<option key={key} value={position}>{position}</option>);
                }
            })
        );

        return renderedPosition;
    },
    _renderSubOptions: function(player) {
        const self = this;

        if(player.sub) {
            return  (
                <input
                    onClick={self._onCheckSub.bind(self, player.id)}
                    type="checkbox"
                    checked="checked"
                />
            );
        } else {
            return (
                <input
                    onClick={self._onCheckSub.bind(self, player.id)}
                    type="checkbox"
                />
            );

        }
    },
    _renderPlayers: function () {
        const self = this,
              players = self.getBinding('players');

        return players.get().map(function (player) {
			return (
                <tr className="bPlayer" key={player.get('id')}>
				    <td className="ePlayer_name">{player.get('user').get('firstName')} {player.get('user').get('lastName')}</td>
                    <td className="ePlayer_form">{player.get('form').get('name')}</td>
                    <td className="ePlayer_position">
                        <select onChange={self._onSelectPosition.bind(self, player.get('id'))}>
                            {self._renderPositionOptions(player.toJS())}
                        </select>
                    </td>
                    <td className="ePlayer_sub">
                        {self._renderSubOptions(player.toJS())}
                    </td>
                    <td className="ePlayer_remove" onClick={self._onRemovePlayer.bind(null, player.get('id'))}>
					    <SVG icon="icon_trash" />
				    </td>
			    </tr>
            );
        }).toArray();
    },
    render: function() {
        const self = this,
            rivalId  = self.getBinding('rivalId').toJS();

        return (
                <div className="bTeam" key={rivalId}>
                    <table>
                        <thead>
                        <tr className="bPlayer mHead">
                            <td className="ePlayer_name">Name</td>
                            <td className="ePlayer_form">Form</td>
                            <td className="ePlayer_position">Position</td>
                            <td className="ePlayer_sub">Sub</td>
                            <td className="ePlayer_remove"></td>
                        </tr>
                        </thead>
                        <tbody>
                        {self._renderPlayers()}
                        </tbody>
                    </table>
                </div>
        );
    }
});

module.exports = Team;