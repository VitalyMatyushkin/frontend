const EventHelper = require('module/helpers/eventHelper');

const savingPlayerChangesPopupHelper = {
	isUserCreateNewTeam: function(event, teamWrappers) {
		//const event = this.getDefaultBinding().toJS('model');

		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				return this.isUserCreateNewTeamByOrder(0, teamWrappers);
			default :
				return (
					this.isUserCreateNewTeamByOrder(0, teamWrappers) ||
					this.isUserCreateNewTeamByOrder(1, teamWrappers)
				);
		}
	},
	isUserCreateNewTeamByOrder: function(order, teamWrappers) {
		return (
			typeof teamWrappers[order].selectedTeamId === 'undefined' &&
			!teamWrappers[order].isSetTeamLater
		);
	},
	isAnyTeamChanged: function(event, teamWrappers) {
		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				return this.isTeamChangedByOrder(0, teamWrappers);
			default :
				return (
					this.isTeamChangedByOrder(0, teamWrappers) ||
					this.isTeamChangedByOrder(1, teamWrappers)
				);
		}
	},
	isTeamChangedByOrder: function(order, teamWrappers) {
		return teamWrappers[order].isTeamChanged;
	}
};

module.exports = savingPlayerChangesPopupHelper;