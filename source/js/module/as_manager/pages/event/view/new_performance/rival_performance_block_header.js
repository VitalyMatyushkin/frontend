const	React				= require('react'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		PerformanceStyle	= require('../../../../../../../styles/pages/event/b_event_performance_teams.scss');

const RivalPerformanceBlockHeader = React.createClass({
	propTypes: {
		rival:				React.PropTypes.object.isRequired,
		event:				React.PropTypes.object.isRequired
	},
	render: function() {
		let text = '';

		if(TeamHelper.isHousesEventForTeamSport(this.props.event)) {
			text = this.props.rival.house.name;
		} else if(TeamHelper.isInternalEventForTeamSport(this.props.event)) {
			text = this.props.rival.team.name;
		}

		return (
			<div className="eEventPerformance_colHeader">
				{ text }
			</div>
		);
	}
});

module.exports = RivalPerformanceBlockHeader;