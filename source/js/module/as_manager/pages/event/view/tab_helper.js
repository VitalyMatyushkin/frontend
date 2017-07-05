const TeamHelper = require('module/ui/managers/helpers/team_helper');

const TabHelper = {
	/**
	 * True, if event object have one or more teams(or players) from activeSchool.
	 */
	isShowEditButtonByEvent: function(activeSchoolId, event) {
		if(TeamHelper.isTeamSport(event)) {
			return event.teamsData.filter(teamData => teamData.schoolId === activeSchoolId).length > 0;
		} else if(TeamHelper.isNonTeamSport(event)) {
			return event.individualsData.filter(playerData => playerData.schoolId === activeSchoolId).length > 0;
		}
	}
};

module.exports = TabHelper;