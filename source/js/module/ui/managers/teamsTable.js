const   React                = require('react'),
        classNames           = require('classnames'),
        MoreartyHelper       = require('module/helpers/morearty_helper'),
        Immutable            = require('immutable');

const TeamsTable = React.createClass({
    mixins: [Morearty.Mixin],
    propTypes: {
        onTeamClick: React.PropTypes.func
    },
    componentWillMount: function () {
        const self = this,
            binding = self.getDefaultBinding();

        self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

        const model = self.getBinding().model.toJS(),
            rival = self.getBinding().rival.toJS();

        let filter = {
            where: {
                schoolId: self.activeSchoolId,
                gender: model.gender,
                sportId: model.sportId,
                tempTeam: false,
                ages: {
                        inq: model.ages
                    }
            },
            include: ['sport','players']
        };

        window.Server.teams.get({filter: filter}).then((teams)  => {
            let filteredTeams = [];

            teams.forEach((team) => {
                if(team.ages.length <= model.ages.length) {
                    switch (model.type) {
                        case 'houses':
                            if(self._isAllPlayersFromHouse(rival.id, team.players)) {
                                filteredTeams.push(team);
                            }
                            break;
                        default:
                            filteredTeams.push(team);
                            break;
                    }
                }
            });

            binding
                .atomically()
                .set('teams', Immutable.fromJS(filteredTeams))
                .commit();
        });
    },

    /**
     *
     * @param houseId
     * @param players
     * @returns {boolean} true if all players from current house
     * @private
     */
    _isAllPlayersFromHouse: function(houseId, players) {
        let isAllFromCurrentHouse = true;

        for(let i = 0; i < players.length; i++) {
            if(players[i].houseId != houseId) {
                isAllFromCurrentHouse = false;
                break;
            }
        }

        return isAllFromCurrentHouse;
    },
    /**
     * Convert ages array to table view
     * @private
     */
    _geAgesTableView: function(ages) {
        let result = '';

        if(ages !== undefined) {
            result = ages.map(elem => {
                return `Y${elem}`;
            }).join(";");
        }

        return result;
    },
    /**
     * Handler for click on team in team table
     * @param teamId
     * @private
     */
    _onTeamClick: function(teamId) {
        const self = this;

        self.props.onTeamClick(teamId);
    },
    /**
     * Render teams items for teams table
     * @private
     */
    _getTeams: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            teams = binding.toJS('teams'),
            exceptionTeamId = binding.toJS('exceptionTeamId');

        let result = [];

        if(teams) {
            teams.forEach(team => {
                if(exceptionTeamId != team.id) {
                    let rowClassName = classNames({
                        eTeamsTable_row: true,
                        mSelected: team.id == self.getDefaultBinding().toJS('selectedTeamId')
                    });
                    result.push((
                        <tr className={rowClassName} onClick={self._onTeamClick.bind(self, team.id)}>
                            <td className="eTeamsTable_cell mName">{team.name}</td>
                            <td className="eTeamsTable_cell mGender">{team.gender}</td>
                            <td className="eTeamsTable_cell mAges">{self._geAgesTableView(team.ages)}</td>
                        </tr>
                    )) ;
                }
            });
        }

        return result;
    },
    render: function() {
        const self = this;

        return (
            <table className="bTeamsTable">
                <thead>
                <tr className="eTeamsTable_row mHead">
                    <td className="eTeamsTable_cell mName">Team Name</td>
                    <td className="eTeamsTable_cell mGender">Gender</td>
                    <td className="eTeamsTable_cell mAges">Ages</td>
                </tr>
                </thead>
                <tbody>
                {self._getTeams()}
                </tbody>
            </table>
        );
    }
});

module.exports = TeamsTable;