var FootballManager,
    SVG = require('module/ui/svg'),
	Autocomplete = require('module/ui/autocomplete/autocomplete');

FootballManager = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			players: [],
			autocomplete: {}
		});
	},
    getIncludePlayersIds: function () {
        var self = this,
            eventBinding = self.getBinding('event'),
            rivalsType = eventBinding.get('newEvent.model.rivalsType'),
            firstTeam = eventBinding.get('newEvent.teams.first.players').map(function (player) {
                return player.get('id');
            }),
            secondTeam = rivalsType !== 'schools' ? eventBinding.get('newEvent.teams.second.players').map(function (player) {
                return player.get('id');
            }) : null;

        return secondTeam !== null ? firstTeam.toJS().concat(secondTeam.toJS()) : firstTeam;
    },
	/**
	 * Service for filtering learner
	 * @param schoolId
	 * @param learnerName
	 * @returns {*}
	 */
	serviceLearnersFilter: function (schoolId, learnerName) {
		var self = this,
			binding = self.getDefaultBinding(),
			filter = {
				where: {
					schoolId: schoolId,
                    id: {
                        nin: self.getIncludePlayersIds()
                    },
					or: [
						{
							firstName: {
								like: learnerName,
								options: 'i'
							}
						},
						{
							lastName: {
								like: learnerName,
								options: 'i'
							}
						}
					]
				}
			};

		if (binding.get('newEvent.model.rivalsType') === 'houses') {
			filter.where.houseId = binding.get('autocompletehouses.selectedId');
		} else if (binding.get('newEvent.model.rivalsType') === 'classes') {
			filter.where.classId = binding.get('autocompleteclasses.selectedId');
		}

		return window.Server.learnersFilter.get({
			filter: filter
		}).then(function (data) {
			data.map(function (player) {
				var name = player.firstName + ' ' + player.lastName;
				player.name = name;

				return player.name;
			});

			return data;
		});
	},
	onSelectLearner: function (selectId, response, model) {
        var self = this,
            players = self.getDefaultBinding().sub('players');

		if (model) {
            players.update(function (data) {
                var models,
                    found = data.some(function (m) {
                        return m.get('id') === model.id;
                    });

                if (!found) {
                    models = data.push(Immutable.fromJS(model));
                } else {
                    models = data;
                }

                return models;
            });
        }
	},
    _removePlayer: function (playerId) {
        var self = this,
            players = self.getDefaultBinding().get('players');

        players.update(function (data) {
           return data.filter(function (model) {
               return model.get('id') !== playerId;
           })
        });
    },
    getPlayers: function () {
        var self = this,
            players = self.getDefaultBinding().get('players');

        return players.map(function (player) {
            return <div className="ePlayer" key={player.get('id')}>
                <span className="ePlayer_number">{'#'}</span>
                <span className="ePlayer_name">{player.get('name')}</span>
                <span className="ePlayer_remove" onClick={self._removePlayer.bind(null, player.get('id'))}>
                    <SVG icon="icon_trash" />
                </span>
            </div>
        }).toArray();
    },
	render: function() {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			binding = self.getDefaultBinding();

		return <div className="eManagerGame_team">
            {self.getPlayers()}
			<Autocomplete
				serviceFilter={self.serviceLearnersFilter.bind(null, activeSchoolId)}
				serverField="name"
				onSelect={self.onSelectLearner}
				binding={binding.sub('teams.autocomplete')}
			/>
		</div>

	}
});

module.exports = FootballManager;
