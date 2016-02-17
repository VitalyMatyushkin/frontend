const   FootballManager     = require('./football/football'),
        AutocompleteTeam    = require('./autocompleteTeam'),
        React               = require('react'),
        classNames          = require('classnames'),
        Team                = require('./team'),
        Immutable 	        = require('immutable');

const Manager = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('students', Immutable.List());
    },
    showError: function() {
        alert("Bad players count");
    },
    onChooseRival: function (index) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('selectedRivalIndex', index);
    },
    getRivals: function () {
        const self = this,
              binding = self.getDefaultBinding(),
              selectedRivalIndex = binding.get('selectedRivalIndex'),
              rivalsBinding = self.getBinding('rivals');

        return rivalsBinding.get().map(function (rival, index) {
            var disable = self._isRivalDisable(rival),
				teamClasses = classNames({
					mActive: selectedRivalIndex == index,
					eChooser_item: true,
					mDisable: disable
				});

            return (
                <span className={teamClasses}
                      onClick={!disable ? self.onChooseRival.bind(null, index) : null}>{rival.get('name')}
                </span>
            );
        }).toArray();
    },
    _isRivalDisable: function(rival) {
        const self = this,
              binding = self.getDefaultBinding();

        return (
            rival.get('id') !== binding.get('schoolInfo.id') &&
            binding.get('model.type') === 'inter-schools'
        );
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            selectedRivalIndex = binding.get('selectedRivalIndex'),
            teamBinding = {
                default:  binding,
                rival:    binding.sub('rivals.' + selectedRivalIndex),
                players:  binding.sub('players.' + selectedRivalIndex),
                error:    binding.sub('error.' + selectedRivalIndex),
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
