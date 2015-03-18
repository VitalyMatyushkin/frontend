var Manager,
	FootballManager = require('./football/football'),
    AutocompleteTeam = require('./autocompleteTeam'),
    Team = require('./team');

Manager = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            selectedRivalId = binding.get('rivals.0.id');

        if (selectedRivalId) {
            binding.set('selectedRivalId', selectedRivalId);
        }
    },
    onChooseRival: function (rivalId) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('selectedRivalId', rivalId);
    },
    getRivals: function () {
        var self = this,
            binding = self.getDefaultBinding(),
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			userId = rootBinding.get('userData.authorizationInfo.userId'),
			rivalsType = binding.get('model.rivalsType'),
            selectedRivalId = binding.get('selectedRivalId');

        return binding.get('rivals').map(function (rival) {
            var disable = rivalsType === 'schools' ?
                rival.get('id') !== activeSchoolId || rival.get('ownerId') !== userId : false,
				teamClasses = classNames({
					mActive: selectedRivalId === rival.get('id'),
					eChooser_item: true,
					mDisable: disable
				});

            return <span
                className={teamClasses}
                onClick={!disable ? self.onChooseRival.bind(null, rival.get('id')) : null}>{rival.get('name')}</span>;
        }).toArray();
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            selectedRivalId = binding.get('selectedRivalId'),
            rivalIndex = binding.get('rivals').findIndex(function (rival) {
               return rival.get('id') === selectedRivalId;
            }),
            teamBinding = {
                default: binding,
                rival: binding.sub('rivals.' + rivalIndex)
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
