const	Immutable			= require('immutable'),
		Promise				= require('bluebird'),
		EventHelper			= require('../../../../helpers/eventHelper'),
		ScoreChangesHelper	= require('../../../../helpers/score/score_changes_helper'),
		TeamHelper			= require('../../../../ui/managers/helpers/team_helper');

/**
 * Function check user changes, and if team name was changed by user, then function submit these changes to server.
 * @param activeSchoolId
 * @param binding
 * @returns {Promise}
 */
function changeTeamNames(activeSchoolId, binding) {
	const event = binding.toJS('model');

	let promises = [];

	if(!TeamHelper.isNonTeamSport(event)) {
		if(
			!isSetTeamLaterByOrder(0, binding) &&
			!isTeamChangedByOrder(0, binding) &&
			isNameTeamChangedByOrder(0, binding)
		) {
			promises = promises.concat(TeamHelper.updateTeam(
				activeSchoolId,
				binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${0}.selectedTeamId`),
				{
					name: binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${0}.teamName.name`)
				}
			));
		}

		if(
			!EventHelper.isInterSchoolsEvent(event) &&
			!isSetTeamLaterByOrder(1, binding) &&
			!isTeamChangedByOrder(1, binding) &&
			isNameTeamChangedByOrder(1, binding)
		) {
			promises = promises.concat(TeamHelper.updateTeam(
				activeSchoolId,
				binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${1}.selectedTeamId`),
				{
					name: binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${1}.teamName.name`)
				}
			));
		}
	}

	return Promise.all(promises);
};

function isSetTeamLaterByOrder(order, binding) {
	return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.isSetTeamLater`);
};

function isTeamChangedByOrder(order, binding) {
	return (
		// if selected team undefined then player create addHoc team or team was deleted
		typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`) === 'undefined'||
		(
			binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`) !==
			binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`)
		)
	);
};

function isNameTeamChangedByOrder(order, binding) {
	const	initName	= binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.teamName.initName`),
			name		= binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.teamName.name`);

	return  initName !== name;
};

/**
 * Submit team player changes
 */
function commitPlayersChanges(activeSchoolId, binding) {
	const event = binding.toJS('model');

	let promises = [];

	if(TeamHelper.isNonTeamSport(event)) {
		promises = promises.concat(commitIndividualPlayerChanges(activeSchoolId, binding));
	} else {
		promises = promises.concat(commitTeamChangesByOrder(0, activeSchoolId, binding));
		!EventHelper.isInterSchoolsEvent(event) && (promises = promises.concat(commitTeamChangesByOrder(1, activeSchoolId, binding)));
	}

	return Promise.all(promises);
};

function changeEventScoreAfterChanges(activeSchoolId, binding) {
	const event = binding.toJS('model');

	let promises = [];

	if(TeamHelper.isNonTeamSport(event)) {
		promises = promises.concat(changeIndividualScore(activeSchoolId, binding));
	} else {
		promises = promises.concat(correctTeamScoreByPlayerChanges(0, activeSchoolId, binding));
		!EventHelper.isInterSchoolsEvent(event) && (promises = promises.concat(correctTeamScoreByPlayerChanges(1, activeSchoolId, binding)));
	}

	return Promise.all(promises);
};

function changeIndividualScore(activeSchoolId, binding) {
	const event = binding.toJS('model');

	const	eventId			= event.id,
			players			= getCommitPlayersForIndividualEvent(event, binding),
			initialPlayers	= getInitPlayersForIndividualEvent(event, binding);

	return Promise.all(ScoreChangesHelper.deleteNonExistentIndividualScore(activeSchoolId, eventId, initialPlayers, players));
};

function correctTeamScoreByPlayerChanges(order, activeSchoolId, binding) {
	let promises = [];

	switch (true) {
		// Team was deleted and isSetTeamLater was setted true.
		// So, we should:
		// 1) Converts team score to school score or houses score it depends on event type.
		// 2) Delete all individual score for removed team.
		// 3) Set IndividualScoreAvailable to false.
		case isSetTeamLaterByOrder(order, binding) && isTeamWasDeletedByOrder(order, binding):
			const teamId = getPrevTeamIdByOrder(order, binding);
			promises = promises.concat(convertTeamScoreByTeamId(teamId, activeSchoolId, binding));
			promises = promises.concat(deleteAllIndividualScoreByTeamId(teamId, activeSchoolId, binding));
			// TODO must implement this. but now, waiting for server.
			//promises = promises.concat(setIndividualScoreAvailableByTeamId(teamId));
			break;
		//TODO when isSetTeamLater was setted to false.
		case !isSetTeamLaterByOrder(order, binding) && isTeamWasCreatedByOrder(order, binding):

			break;
		// Team was just changed.
		// 1) Moves team score from prev team to current team
		// 2) Delete all individual score for removed team.
		// 3) Set IndividualScoreAvailable to false.
		case !isSetTeamLaterByOrder(order, binding) && isTeamChangedByOrder(order, binding):
			const	prevTeamId		= getPrevTeamIdByOrder(order, binding),
					currentTeamId	= getTeamIdByOrder(order, binding);

			promises = promises.concat(moveTeamScoreFromPrevTeamToCurrentTeam(prevTeamId, currentTeamId, activeSchoolId, binding));
			promises = promises.concat(deleteAllIndividualScoreByTeamId(prevTeamId, activeSchoolId, binding));
			// TODO must implement this. but now, waiting for server.
			//promises = promises.concat(setIndividualScoreAvailableByTeamId(teamId));
			break;
		// Team players was changed.
		// 1) Corrects team score by depend on player changes. I mean, if player was removed and he has some score points
		// we should delete these points from team score.
		// 2) Corrects individual score by depend on player changes. I mean, if player was removed and he has some score points
		// we should delete these points from individual score.
		case !isSetTeamLaterByOrder(order, binding) && !isTeamChangedByOrder(order, binding):
			const teamId = getTeamIdByOrder(order, binding);

			promises = promises.concat(correctScoreByRemovedPlayers(order, teamId, activeSchoolId, binding));
			break;
	}

	return promises;
};

function correctScoreByRemovedPlayers(order, teamId, activeSchoolId, binding) {
	const	event			= binding.toJS('model'),
			tw				= binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}`),
			prevPlayers		= tw.prevPlayers,
			currentPlayers	= tw.___teamManagerBinding.teamStudents;

	const removedPlayers = TeamHelper.getRemovedPlayers(prevPlayers, currentPlayers);

	let promises = [];
	promises = promises.concat(
		ScoreChangesHelper.correctTeamScoreByRemovedPlayers(activeSchoolId, event, teamId, removedPlayers)
	);
	promises = promises.concat(
		ScoreChangesHelper.correctIndividualScoreByRemovedPlayers(activeSchoolId, event, teamId, removedPlayers)
	);

	return promises;
};

function moveTeamScoreFromPrevTeamToCurrentTeam(prevTeamId, currentTeamId, activeSchoolId, binding) {
	const	event		= binding.toJS('model'),
			teamScore	= event.result.teamScore;

	return ScoreChangesHelper.moveTeamScoreToOtherTeam(prevTeamId, currentTeamId, activeSchoolId, event.id, teamScore);
};

function convertTeamScoreByTeamId(teamId, activeSchoolId, binding) {
	const	event	= binding.toJS('model');

	let promises = [];

	promises = promises.concat(ScoreChangesHelper.deleteTeamScoreByEventAndTeamId(activeSchoolId, event, teamId));
	switch (true) {
		case EventHelper.isInterSchoolsEvent(event):
			promises = promises.concat(ScoreChangesHelper.convertTeamScoreToSchoolScoreByEventAndTeamId(activeSchoolId, event, teamId));
			break;
		case EventHelper.isHousesEvent(event):
			promises = promises.concat(ScoreChangesHelper.convertTeamScoreToHousesScoreByEventAndTeamId(activeSchoolId, event, teamId));
			break;
	}

	return promises;
};

function deleteAllIndividualScoreByTeamId(teamId, activeSchoolId, binding) {
	const	event			= binding.toJS('model'),
			individualScore	= event.result.individualScore;

	return ScoreChangesHelper.deleteAllIndividualScoreByTeamId(activeSchoolId, event.id, teamId, individualScore);
}

/**
 * Submit players changes for individual game
 */
function commitIndividualPlayerChanges(activeSchoolId, binding) {
	const event = binding.toJS('model');

	const	eventId			= event.id,
			players			= getCommitPlayersForIndividualEvent(event, binding),
			initialPlayers	= getInitPlayersForIndividualEvent(event, binding);

	return Promise.all(TeamHelper.commitIndividualPlayers(activeSchoolId, eventId, initialPlayers, players));
};

function getCommitPlayersForIndividualEvent(event, binding) {
	if(TeamHelper.isInternalEventForIndividualSport(event) || TeamHelper.isInterSchoolsEventForNonTeamSport(event)) {
		return getTeamPlayersByOrder(0, binding);
	} else {
		return getTeamPlayersByOrder(0, binding).concat(getTeamPlayersByOrder(1, binding));
	}
};

function getTeamPlayersByOrder(order, binding) {
	return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.___teamManagerBinding.teamStudents`);
};

function getInitPlayersForIndividualEvent(event, binding) {
	if(TeamHelper.isInternalEventForIndividualSport(event) || TeamHelper.isInterSchoolsEventForNonTeamSport(event)) {
		return getInitialTeamPlayersByOrder(0, binding);
	} else {
		return getInitialTeamPlayersByOrder(0, binding).concat(getInitialTeamPlayersByOrder(1, binding));
	}
};

function getInitialTeamPlayersByOrder(order, binding) {
	return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevPlayers`);
};

/** Submit team players changes for team game.
 */
function commitTeamChangesByOrder(order, activeSchoolId, binding) {
	let promises = [];

	switch (true) {
		case isSetTeamLaterByOrder(order, binding) && isTeamWasDeletedByOrder(order, binding):
			promises = promises.concat(removePrevSelectedTeamFromEventByOrder(order, activeSchoolId, binding));
			break;
		case !isSetTeamLaterByOrder(order, binding):
			if(isTeamChangedByOrder(order, binding)) {
				promises = promises.concat(changeTeamByOrder(order, activeSchoolId, binding));
			} else {
				promises = promises.concat(commitTeamPlayerChangesByOrder(order, activeSchoolId, binding));
			}
			break;
	}

	return promises;
};

function removePrevSelectedTeamFromEventByOrder(order, activeSchoolId, binding) {
	const prevSelectedTeamId = binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`);

	return TeamHelper.deleteTeamFromEvent(
		activeSchoolId,
		binding.toJS('model').id,
		prevSelectedTeamId
	);
};

function getTeamIdByOrder(order, binding) {
	return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`);
};

function getPrevTeamIdByOrder(order, binding) {
	return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`);
};

function isTeamWasDeletedByOrder(order, binding) {
	return (
		typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`) !== 'undefined' &&
		typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`) === 'undefined'
	);
};

function isTeamWasCreatedByOrder(order, binding) {
	return (
		typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`) === 'undefined' &&
		typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`) !== 'undefined'
	);
};

function changeTeamByOrder(order, activeSchoolId, binding) {
	let team;

	return TeamHelper.createTeam(
			activeSchoolId,
			binding.toJS('model'),
			binding.toJS(`teamManagerWrapper.default.rivals.${order}`),
			binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}`)
		)
		.then(_team => {
			team = _team;

			const prevSelectedTeamId = binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`);

			if(typeof prevSelectedTeamId !== 'undefined') {
				return TeamHelper.deleteTeamFromEvent(
					activeSchoolId,
					binding.toJS('model').id,
					prevSelectedTeamId
				);
			} else {
				return Promise.resolve(true);
			}
		})
		.then(() => TeamHelper.addTeamsToEvent(
			activeSchoolId,
			binding.toJS('model'),
			[team]
		));
};

function commitTeamPlayerChangesByOrder(order, activeSchoolId, binding) {
	const tw = binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}`);

	return Promise.all(
		TeamHelper.commitPlayers(
			tw.prevPlayers,
			tw.___teamManagerBinding.teamStudents,
			tw.selectedTeamId,
			activeSchoolId
		)
	);
};

function submitAllChanges(activeSchoolId, binding) {
	return changeTeamNames(activeSchoolId, binding)
		.then(() => commitPlayersChanges(activeSchoolId, binding))
		.then(() => changeEventScoreAfterChanges(activeSchoolId, binding));
};

module.exports.changeTeamNames				= changeTeamNames;
module.exports.isSetTeamLaterByOrder		= isSetTeamLaterByOrder;
module.exports.isTeamChangedByOrder			= isTeamChangedByOrder;
module.exports.isNameTeamChangedByOrder		= isNameTeamChangedByOrder;
module.exports.commitPlayersChanges			= commitPlayersChanges;
module.exports.changeEventScoreAfterChanges	= changeEventScoreAfterChanges;
module.exports.submitAllChanges				= submitAllChanges;