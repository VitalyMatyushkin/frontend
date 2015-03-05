var FootballManager,
	Autocomplete = require('module/ui/autocomplete/autocomplete');

FootballManager = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			players: [],
			autocomplete: {}
		});
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
	onSelectLearner: function (selectId, response) {

		console.log(arguments)
	},
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
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('activeSchoolId'),
			binding = self.getDefaultBinding();

		return <div className="eManagerGame_team">
            {self.getPlayers}
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
