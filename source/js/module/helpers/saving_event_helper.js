const	ManagerConsts	= require('./../ui/managers/helpers/manager_consts'),
		TeamHelper		= require('./../ui/managers/helpers/team_helper'),
		EventHelper		= require('./eventHelper'),
		Promise			= require('bluebird');

function processSavingChangesMode(schoolId, event, teamWrappers) {
	switch (true) {
		case EventHelper.isInterSchoolsEvent(event) && teamWrappers[0].isTeamChanged:
			return processTeam(schoolId, teamWrappers[0], teamWrappers[0].savingChangesMode);
		default:
			let promises = [];

			teamWrappers.forEach(tw => {
				if(tw.isTeamChanged) {
					promises = promises.concat(processTeam(schoolId, tw, tw.savingChangesMode));
				}
			});

			return promises;
	}
};

function processTeam(schoolId, teamWrapper, savingChangesMode) {
	switch (savingChangesMode) {
		case ManagerConsts.SAVING_CHANGES_MODE.SAVE_CHANGES_TO_PROTOTYPE_TEAM:
			let promises = [];

			promises.push(TeamHelper.updateTeam(
				schoolId,
				teamWrapper.selectedTeamId,
				{
					name: teamWrapper.teamName.name
				}
			));

			const	players			= teamWrapper.___teamManagerBinding.teamStudents,
					initialPlayers	= teamWrapper.prevPlayers;
			promises = promises.concat(
				TeamHelper.commitPlayers(
					initialPlayers,
					players,
					teamWrapper.selectedTeamId,
					schoolId
				)
			);
			return promises;
		case ManagerConsts.SAVING_CHANGES_MODE.SAVE_CHANGES_TO_NEW_PROTOTYPE_TEAM:
			let team;

			return window.Server.cloneAsPrototypeTeam.post({
				schoolId:	schoolId,
				teamId:		teamWrapper.selectedTeamId
			})
			.then(_team => {
				team = _team;

				return TeamHelper.updateTeam(
					schoolId,
					team.id,
					{
						name: teamWrapper.teamName.name
					}
				);
			})
			.then(() => {
				const	players			= teamWrapper.___teamManagerBinding.teamStudents,
						initialPlayers	= teamWrapper.prevPlayers;

				return Promise.all(TeamHelper.commitPlayers(
					initialPlayers,
					players,
					team.id,
					schoolId
				));
			});
		case ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES:
			return [Promise.resolve(true)];
	}
};

const SavingEventHelper = {
	processSavingChangesMode: processSavingChangesMode
};

module.exports = SavingEventHelper;