const savingPlayerChangesPopupHelper = {
	isUserCreateNewTeam: function(event, teamWrappers) {
		const resultArray = teamWrappers.map(tw => this.isUserCreateNewTeamByTeamWrapper(tw));

		let result = false;
		for(let i = 0; i < resultArray.length; i++) {
			if(resultArray[i]) {
				result = true;
				break;
			}
		}

		return result;
	},
	isUserCreateNewTeamByTeamWrapper: function(teamWrapper) {
		return (
			typeof teamWrapper.selectedTeamId === 'undefined' &&
			!teamWrapper.isSetTeamLater
		);
	},
	isAnyTeamChanged: function(event, teamWrappers) {
		const resultArray = teamWrappers.map(tw => this.isTeamChangedByTeamWrapper(tw));

		let result = false;
		for(let i = 0; i < resultArray.length; i++) {
			if(resultArray[i]) {
				result = true;
				break;
			}
		}

		return result;
	},
	isTeamChangedByTeamWrapper: function(teamWrapper) {
		return teamWrapper.isTeamChanged;
	}
};

module.exports = savingPlayerChangesPopupHelper;