var Manager,
	FootballManager = require('./football/football'),
    MultiSelectTeam = require('./multiselect_team'),
    AutocompleteTeam = require('./autocompleteTeam'),
    Team = require('./team');

Manager = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('students', Immutable.List());
        self.onChooseRival(0);
    },
    onChooseRival: function (index) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('selectedRivalIndex', index);
    },
    getRivals: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            selectedRivalIndex = binding.get('selectedRivalIndex'),
            rivalsBinding = self.getBinding('rivals');

        return rivalsBinding.get().map(function (rival, index) {
            var disable = rival.get('id') !== binding.get('schoolInfo.id')
                    && binding.get('model.type') === 'inter-schools',
				teamClasses = classNames({
					mActive: selectedRivalIndex === index,
					eChooser_item: true,
					mDisable: disable
				});

            return <span
                className={teamClasses}
                onClick={!disable ? self.onChooseRival.bind(null, index) : null}>{rival.get('name')}</span>;
        }).toArray();
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            selectedRivalIndex = binding.get('selectedRivalIndex'),
            teamBinding = {
                default: binding,
                rival: binding.sub('rivals.' + selectedRivalIndex),
                players: binding.sub('players.' + selectedRivalIndex),
                students: binding.sub('students')
            };

            return <div className="eManager_container">
                <div className="eManager_chooser">
                    <div className="bChooser">
                        <span className="eChooser_title">Choose a team:</span>
                        {self.getRivals()}
                    </div>
                    <AutocompleteTeam binding={teamBinding} />
                </div>
                <div className="eManager_containerTeam">
                    <FootballManager binding={teamBinding} />
                    <Team binding={teamBinding} />
                </div>
            </div>;
	}
});

module.exports = Manager;
