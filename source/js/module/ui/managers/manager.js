var Manager,
	FootballManager = require('./football/football'),
    AutocompleteTeam = require('./autocompleteTeam'),
    Team = require('./team');

Manager = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            selectedRivalId = binding.get('newEvent.rivals.0.id');

        if (selectedRivalId) {
            binding.set('newEvent.selectedRivalId', selectedRivalId);
        }
    },
    onChooseRival: function (rivalId) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('newEvent.selectedRivalId', rivalId);
    },
    getRivals: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            selectedRivalId = binding.get('newEvent.selectedRivalId');

        return binding.get('newEvent.rivals').map(function (rival) {
            var teamClasses = classNames({
                mActive: selectedRivalId === rival.get('id'),
                eChooser_item: true
            });

            return <span
                className={teamClasses}
                onClick={self.onChooseRival.bind(null, rival.get('id'))}>{rival.get('name')}</span>;
        }).toArray();
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            selectedRivalId = binding.get('newEvent.selectedRivalId'),
            rivalIndex = binding.get('newEvent.rivals').findIndex(function (rival) {
               return rival.get('id') === selectedRivalId;
            }),
            teamBinding = {
                default: binding.sub('newEvent'),
                rival: binding.sub('newEvent.rivals.' + rivalIndex)
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
