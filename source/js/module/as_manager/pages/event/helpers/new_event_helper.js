const TeamHelper = require('module/ui/managers/helpers/team_helper');

/**
 * It's temporary staff for new event. Only for refactoring time.
 */
const NewEventHelper = {
	/**
	 * Function returns true when we should use new event rivals component
	 * @param event
	 * @returns {*|boolean}
	 */
	isNewEvent: function(event) {
		return (
			(
				TeamHelper.isInterSchoolsEventForTeamSport(event) ||
				TeamHelper.isHousesEventForTeamSport(event) ||
				TeamHelper.isInternalEventForTeamSport(event)
			) && event.sport.multiparty
		);
	},
	/**
	 * Function returns true when we should use new tab component
	 * @param event
	 * @returns {*|boolean}
	 */
	isNewTabs: function(event) {
		return (
			TeamHelper.isHousesEventForTeamSport(event) ||
			TeamHelper.isInternalEventForTeamSport(event)
		);
	}
};

module.exports = NewEventHelper;
