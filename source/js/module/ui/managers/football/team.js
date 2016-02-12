const 	SVG 			= require('module/ui/svg'),
		React 			= require('react'),
		ReactDOM 		= require('reactDom'),
		Immutable 		= require('immutable'),
		Autocomplete 	= require('module/ui/autocomplete2/OldAutocompleteWrapper');

const FootballManager = React.createClass({
	mixins: [Morearty.Mixin],
    propTypes: {
        order: React.PropTypes.number.isRequired
    },
	getDefaultState: function () {
		var self = this,
			state = {
				rivals: []
			};


		state.rivals[self.props.order] = {
			players: [],
			autocomplete: {}
		};

		return Immutable.fromJS(state);
	},
    getIncludePlayersIds: function () {
        var self = this,
            binding = self.getDefaultBinding();

		return binding.get('rivals').toArray().reduce(function (memo, team) {
			var ids = [];

			if (team.get('players')) {
				ids = team.get('players').map(function (player) {
					return player.get('id');
				});
			}

			return memo.concat(ids);
		}, Immutable.List());
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
			rivalsType = binding.get('newEvent.model.rivalsType'),
			filter = {
				where: {
					schoolId: schoolId,
                    id: {
                        nin: self.getIncludePlayersIds().toJS()
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


		if (rivalsType === 'houses') {
			filter.where.houseId = binding.get(['autocomplete', rivalsType, self.props.order, 'selectedId']);
		} else if (rivalsType === 'classes') {
			filter.where.formId = binding.get(['autocomplete', rivalsType, self.props.order, 'selectedId']);
		}

		return window.Server.students.get(schoolId, {
			filter: filter
		}).then(function (data) {
			data.map(function (player) {
				var name = player.firstName + ' ' + player.lastName;
				player.name = name;

				return player;
			});

			return data;
		});
	},
	onSelectLearner: function (selectId, model) {
        var self = this,
            players = self.getDefaultBinding().sub(['rivals', self.props.order, 'players']);

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
    removePlayer: function (playerId) {
        var self = this,
            players = self.getDefaultBinding().get(['rivals', self.props.order, 'players']);

        players.update(function (data) {
           return data.filter(function (model) {
               return model.get('id') !== playerId;
           });
        });
    },
    getPlayers: function () {
        var self = this,
            players = self.getDefaultBinding().get(['rivals', self.props.order, 'players']);

        return players.map(function (player) {
            return <div className="bManager_ePlayer" key={player.get('id')}>
                <span className="ePlayer_name"><span className="ePlayer_number">{'#'}</span>{player.get('name')}</span>
                <span className="ePlayer_remove" onClick={self.removePlayer.bind(null, player.get('id'))}>
                    <SVG icon="icon_trash" />
                </span>
            </div>
        }).toArray();
    },
	render: function() {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			rivalBinding = self.getBinding('rival');

		return <div className="eManagerGame_team">
            {self.getPlayers()}
            <Autocomplete
				serviceFilter={self.serviceLearnersFilter.bind(null, activeSchoolId)}
				serverField="name"
				onSelect={self.onSelectLearner}
				binding={rivalBinding}
			/>
		</div>

	}
});

module.exports = FootballManager;
