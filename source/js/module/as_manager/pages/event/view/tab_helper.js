const TabHelper = {
	/**
	 * True, if event object have one or more teams from activeSchool.
	 * @param event
	 */
	isShowEditButtonByEvent: function(activeSchoolId, event) {
		return event.teamsData.filter(td => td.schoolId === activeSchoolId).length > 0;
	}
};

module.exports = TabHelper;
