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
				TeamHelper.isInternalEventForTeamSport(event) ||
				TeamHelper.isInterSchoolsEventForIndividualSport(event)
			) && this.isMultiparty(event)
		);
	},
	/**
	 * Function returns true when you my friend must use NewManagerWrapperHelper to get rivals for manager wrapper.
	 * This stuff only for manager wrapper, look at ManagerWrapper.getRivals.
	 * And it's temporary only for new event refactoring period.
	 * @param event
	 * @returns {*|boolean}
	 */
	mustUseNewManagerWraperHelper: function(event) {
		return (
			(
				TeamHelper.isHousesEventForTeamSport(event) ||
				TeamHelper.isInternalEventForTeamSport(event) ||
				TeamHelper.isInterSchoolsEventForIndividualSport(event)
			) && this.isMultiparty(event)
		);
	},
	/**
	 * Function returns true when we should use new tab component
	 * @param event - event model
	 * @returns {*|boolean}
	 */
	isNewTabs: function(event) {
		const isEventTypeCorrect = (
			TeamHelper.isHousesEventForTeamSport(event) ||
			TeamHelper.isInternalEventForTeamSport(event)
		);

		return isEventTypeCorrect && event.sport.multiparty;
	},
	isMultiparty: function(event) {
		let multiparty = typeof event.sport !== 'undefined' ? event.sport.multiparty : event.sportModel.multiparty;

		return multiparty;
	}
};

module.exports = NewEventHelper;
