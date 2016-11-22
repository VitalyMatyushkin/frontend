const EventHelper = require('module/helpers/eventHelper');
// It's temporary

module.exports = {
	isUserCreateNewTeam: function() {
		const event = this.getDefaultBinding().toJS('model');

		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				return this.isUserCreateNewTeamByOrder(0);
			default :
				return (
					this.isUserCreateNewTeamByOrder(0) ||
					this.isUserCreateNewTeamByOrder(1)
				);
		}
	},
	isUserCreateNewTeamByOrder: function(order) {
		return (
			typeof this.getDefaultBinding().toJS(`teamModeView.teamWrapper.${order}.selectedTeamId`) === 'undefined' &&
			!this.getDefaultBinding().toJS(`teamModeView.teamWrapper.${order}.isSetTeamLater`)
		);
	},
	isAnyTeamChanged: function() {
		const event = this.getDefaultBinding().toJS('model');

		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				return this.isTeamChangedByOrder(0);
			default :
				return (
					this.isTeamChangedByOrder(0) ||
					this.isTeamChangedByOrder(1)
				);
		}
	},
	isTeamChangedByOrder: function(order) {

		return this.getDefaultBinding().toJS(`teamModeView.teamWrapper.${order}.isTeamChanged`);
	}
};