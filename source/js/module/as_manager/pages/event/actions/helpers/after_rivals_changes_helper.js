const TeamHelper = require('module/ui/managers/helpers/team_helper');

const AfterRivalsChangesHelper = {
	isSetTeamLaterByOrder: function(order, binding) {
		return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.isSetTeamLater`);
	},
	isTeamChangedByOrder: function(order, binding) {
		return (
			// if selected team undefined then player create addHoc team or team was deleted
			typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`) === 'undefined'||
			(
				binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`) !==
				binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`)
			)
		);
	},
	isNameTeamChangedByOrder: function(order, binding) {
		const	initName	= binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.teamName.initName`),
				name		= binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.teamName.name`);

		return  initName !== name;
	},
	getCommitPlayersForIndividualEvent: function(event, binding) {
		if(TeamHelper.isInternalEventForIndividualSport(event) || TeamHelper.isInterSchoolsEventForNonTeamSport(event)) {
			return this.getTeamPlayersByOrder(0, binding);
		} else {
			return this.getTeamPlayersByOrder(0, binding).concat(this.getTeamPlayersByOrder(1, binding));
		}
	},
	getTeamPlayersByOrder: function(order, binding) {
		return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.___teamManagerBinding.teamStudents`);
	},
	getInitPlayersForIndividualEvent: function(event, binding) {
		if(TeamHelper.isInternalEventForIndividualSport(event) || TeamHelper.isInterSchoolsEventForNonTeamSport(event)) {
			return this.getInitialTeamPlayersByOrder(0, binding);
		} else {
			return this.getInitialTeamPlayersByOrder(0, binding).concat(this.getInitialTeamPlayersByOrder(1, binding));
		}
	},
	getInitialTeamPlayersByOrder: function(order, binding) {
		return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevPlayers`);
	},
	getTeamIdByOrder: function(order, binding) {
		return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`);
	},
	getHouseIdByOrder: function(order, binding) {
		return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.filter.houseId`);
	},
	getPrevTeamIdByOrder: function(order, binding) {
		return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`);
	},
	isTeamWasDeletedByOrder: function(order, binding) {
		return (
			typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`) !== 'undefined' &&
			typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`) === 'undefined'
		);
	},
	isTeamWasCreatedByOrder: function(order, binding) {
		return (
			typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`) === 'undefined' &&
			typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`) !== 'undefined'
		);
	}
};

module.exports.AfterRivalsChangesHelper = AfterRivalsChangesHelper;