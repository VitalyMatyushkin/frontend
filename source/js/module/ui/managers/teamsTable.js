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
            rivals = self.getBinding().rivals.toJS();

        let filter = {
            where: {
                schoolId: self.activeSchoolId,
                    gender: model.gender,
                    sportId: model.sportId,
                    ages: {
                        inq: []
                    }
            },
            include: 'sport'
        };

        if(model.type === 'houses') {
            filter.where.or = [{houseId: rivals[0].id}, {houseId: rivals[1].id}];
        }

        model.ages.forEach((age) => {
            filter.where.ages.inq.push(age);
        });

        window.Server.teams.get({filter: filter}).then((teams)  => {
            binding
                .atomically()
                .set('teams', Immutable.fromJS(teams))
                .commit();
        });
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
            teams = binding.toJS('teams');

        let result = [];

        if(teams) {
            result = teams.map(team => {
                return (
                    <tr className="eTeamsTable_row" onClick={self._onTeamClick.bind(self, team.id)}>
                        <td className="eTeamsTable_cell mName">{team.name}</td>
                        <td className="eTeamsTable_cell mGender">{team.gender}</td>
                        <td className="eTeamsTable_cell mAges">{self._geAgesTableView(team.ages)}</td>
                    </tr>
                );
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