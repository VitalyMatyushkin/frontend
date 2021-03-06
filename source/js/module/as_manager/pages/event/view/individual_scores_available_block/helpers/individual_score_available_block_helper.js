const	TeamHelper	= require('../../../../../../ui/managers/helpers/team_helper'),
		SportHelper	= require('module/helpers/sport_helper');

const IndividualScoreAvailableBlockHelper = {
	hasTeamPlayersByOrder: function(activeSchoolId, event, order) {
		let hasTeamPlayers = false;

		let params;
		switch (order) {
			case 0:
				params = TeamHelper.getParametersForLeftContext(activeSchoolId, event);
				break;
			case 1:
				params = TeamHelper.getParametersForRightContext(activeSchoolId, event);
				break;
		}

		if(typeof params !== 'undefined') {
			const team = event[params.bundleName][params.order];
			// Team is undefined when "set team later" is true and event type is inter-schools.
			// If bundleName isn't teamsData team doesn't have players.
			if(
				params.bundleName === "teamsData" && typeof team !== 'undefined' &&
				typeof team.players !== 'undefined' && team.players.length !== 0
			) {
				hasTeamPlayers = true;
			}
		}

		return hasTeamPlayers;
	},
	/**
	 * Is IndividualScoresAvailable component showing by order.
	 * @param order - is a number, 0 or 1. 0 - left side, 1- right side.
	 */
	isShowIndividualScoresAvailableFlagByOrder: function(activeSchoolId, event, order) {
		const hasTeamPlayers = this.hasTeamPlayersByOrder(activeSchoolId, event, order);

		return !SportHelper.isCricket(event.sport.name) && TeamHelper.isTeamSport(event) && hasTeamPlayers;
	}
};

module.exports = IndividualScoreAvailableBlockHelper;