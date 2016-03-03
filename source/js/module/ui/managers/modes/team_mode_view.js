const   React                = require('react'),
        TeamsTable           = require('./../teamsTable'),
        TeamWrapper           = require('./team_wrapper'),
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
            binding = self.getDefaultBinding(),
            rivalIndex = binding.toJS('selectedRivalIndex'),
            prevSelectedTeamId = binding.toJS(`teamViewer.${rivalIndex}.selectedTeamId`);

        if(prevSelectedTeamId == teamId) {
           self._unselectTeam();
        } else {
            self._selectTeam(teamId);
        }
    },
    _getAnotherRivalIndex: function(rivalIndex) {
        let anotherRivalIndex = 0;
        if(rivalIndex == 0) {
            anotherRivalIndex = 1;
        }

        return anotherRivalIndex;
    },
    _selectTeam: function(teamId) {
        const self = this,
            binding = self.getDefaultBinding(),
            rivalIndex = binding.toJS('selectedRivalIndex'),
            anotherRivalIndex = self._getAnotherRivalIndex(rivalIndex);

        binding
            .atomically()
            .set(
                `teamWrapper.${rivalIndex}.selectedTeamId`,
                Immutable.fromJS(teamId)
            )
            .set(
                `teamTable.${rivalIndex}.selectedTeamId`,
                Immutable.fromJS(teamId)
            )
            .set(
                `teamTable.${anotherRivalIndex}.exceptionTeamId`,
                Immutable.fromJS(teamId)
            )
            .commit();
    },
    _unselectTeam: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            rivalIndex = binding.toJS('selectedRivalIndex'),
            anotherRivalIndex = self._getAnotherRivalIndex(rivalIndex);

        binding
            .atomically()
            .set(
                `teamWrapper.${rivalIndex}.selectedTeamId`,
                Immutable.fromJS(undefined)
            )
            .set(
                `teamTable.${rivalIndex}.selectedTeamId`,
                Immutable.fromJS(undefined)
            )
            .set(
                `teamTable.${anotherRivalIndex}.exceptionTeamId`,
                Immutable.fromJS(undefined)
            )
            .commit();
    },
    _renderTeamTable: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            selectedRivalIndex = binding.toJS('selectedRivalIndex'),
            teamTableBinding = {
                default: binding.sub(`teamTable.${selectedRivalIndex}`),
                model: self.getBinding().model,
                rival: self.getBinding().rivals.sub(selectedRivalIndex)
            };

        return (
            <div className="bTeams">
                <If condition={selectedRivalIndex == 0}>
                    <TeamsTable onTeamClick={self._onTeamClick} binding={teamTableBinding}/>
                </If>
                <If condition={selectedRivalIndex == 1}>
                    <TeamsTable onTeamClick={self._onTeamClick} binding={teamTableBinding}/>
                </If>
            </div>
        );
    },
    _renderTeamWrapper: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            selectedRivalIndex = binding.toJS('selectedRivalIndex'),
            tableWrapperBinding = {
                default: binding.sub(`teamWrapper.${selectedRivalIndex}`),
                rival: self.getBinding().rivals.sub(selectedRivalIndex)
            };

        return (
            <div className="bTeamWrapper mMarginLeft">
                <If condition={selectedRivalIndex == 0}>
                    <TeamWrapper binding={tableWrapperBinding}/>
                </If>
                <If condition={selectedRivalIndex == 1}>
                    <TeamWrapper binding={tableWrapperBinding}/>
                </If>
            </div>
        );
    },
    render: function() {
        const self = this;

        return (
            <div>
                {self._renderTeamTable()}
                {self._renderTeamWrapper()}
            </div>
        );
    }
});

module.exports = TeamModeView;