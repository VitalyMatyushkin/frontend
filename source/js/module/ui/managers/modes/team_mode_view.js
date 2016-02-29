const   React                = require('react'),
        TeamsTable           = require('./../teamsTable'),
        TeamViewer           = require('./../teamViewer'),
        If                   = require('module/ui/if/if'),
        Immutable            = require('immutable');

const TeamModeView = React.createClass({
    mixins: [Morearty.Mixin],
    /**
     * Handler for click on team in team table
     * @param teamId
     * @private
     */
    _onTeamClick: function(teamId) {
        const self = this,
            binding = self.getDefaultBinding();

        binding.set(
            `teamViewer.${binding.get('selectedRivalIndex')}.selectedTeamId`,
            Immutable.fromJS(teamId)
        );
    },
    _renderTeamViewer: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            selectedRivalIndex = binding.toJS('selectedRivalIndex');

        return (
            <div className="bTeamViewer mMarginLeft">
                <If condition={selectedRivalIndex == 0}>
                    <TeamViewer binding={binding.sub(`teamViewer.0`)}/>
                </If>
                <If condition={selectedRivalIndex == 1}>
                    <TeamViewer binding={binding.sub(`teamViewer.1`)}/>
                </If>
            </div>
        );
    },
    render: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            teamTableBinding = {
                default: binding.sub('teamTable'),
                model: self.getBinding().model,
                rivals: self.getBinding().rivals
            };

        return (
            <div>
                <div className="bTeams">
                    <TeamsTable onTeamClick={self._onTeamClick} binding={teamTableBinding}/>
                </div>
                {self._renderTeamViewer()}
            </div>
        );
    }
});

module.exports = TeamModeView;