const	Immutable					= require('immutable'),
		Promise						= require('bluebird'),
		EventHelper					= require('../../../../helpers/eventHelper'),
		CorrectScoreActions			= require('./correct_score_actions'),
		TeamHelper					= require('../../../../ui/managers/helpers/team_helper'),
		AfterRivalsChangesHelper	= require('./helpers/after_rivals_changes_helper');

/**
 * Function check user changes, and if team name was changed by user, then function submit these changes to server.
 * @param activeSchoolId
 * @param binding
 * @returns {Promise}
 */
function changeTeamNames(activeSchoolId, binding) {
	const	event		= binding.toJS('model');
	let		promises	= [];

	if(TeamHelper.isTeamSport(event)) {
		const selectedRivalIndex = binding.toJS('selectedRivalIndex');

		if(
			!AfterRivalsChangesHelper.isSetTeamLaterByOrder(selectedRivalIndex, binding) &&
			!AfterRivalsChangesHelper.isTeamChangedByOrder(selectedRivalIndex, binding) &&
			AfterRivalsChangesHelper.isNameTeamChangedByOrder(selectedRivalIndex, binding)
		) {
			promises = promises.concat(TeamHelper.updateTeam(
				activeSchoolId,
				binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${selectedRivalIndex}.selectedTeamId`),
				{
					name: binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${selectedRivalIndex}.teamName.name`)
				}
			));
		}
	}

	return Promise.all(promises);
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
		promises = promises.concat(commitTeamChangesByOrder(binding.toJS('selectedRivalIndex'), activeSchoolId, binding));
	}

	return Promise.all(promises);
};

/**
 * Submit players changes for individual game
 */
function commitIndividualPlayerChanges(activeSchoolId, binding) {
	const event = binding.toJS('model');

	const	eventId = event.id;
	let		players, initialPlayers;

	if(event.sport.multiparty) {
		const selectedRivalIndex = binding.toJS('selectedRivalIndex');

		players			= AfterRivalsChangesHelper.getCommitPlayersForIndividualEvent(event, binding, selectedRivalIndex);
		initialPlayers	= AfterRivalsChangesHelper.getInitPlayersForIndividualEvent(event, binding, selectedRivalIndex);
	} else {
		players			= AfterRivalsChangesHelper.getCommitPlayersForIndividualEvent(event, binding);
		initialPlayers	= AfterRivalsChangesHelper.getInitPlayersForIndividualEvent(event, binding);
	}

	return Promise.all(TeamHelper.commitIndividualPlayers(activeSchoolId, eventId, initialPlayers, players));
};

/** Submit team players changes for team game.
 */
function commitTeamChangesByOrder(order, activeSchoolId, binding) {
	let promises = [];

	switch (true) {
		case AfterRivalsChangesHelper.isSetTeamLaterByOrder(order, binding) && AfterRivalsChangesHelper.isTeamWasDeletedByOrder(order, binding):
			promises = promises.concat(removePrevSelectedTeamFromEventByOrder(order, activeSchoolId, binding));
			break;
		case !AfterRivalsChangesHelper.isSetTeamLaterByOrder(order, binding):
			if(AfterRivalsChangesHelper.isTeamChangedByOrder(order, binding)) {
				promises = promises.concat(changeTeamByOrder(order, activeSchoolId, binding));
			} else {
				promises = promises.concat(commitTeamPlayerChangesByOrder(order, activeSchoolId, binding));
			}
			break;
	}

	return promises;
};

function removePrevSelectedTeamFromEventByOrder(order, activeSchoolId, binding) {
	const prevSelectedTeamId =
		binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`);

	return TeamHelper.deleteTeamFromEvent(
		activeSchoolId,
		binding.toJS('model').id,
		prevSelectedTeamId
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

			const prevSelectedTeamId =
				binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`);

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
		))
		.then(() => {
			binding.set(
				`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`,
				Immutable.fromJS(team.id)
			);
		});
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

/**
 * This function only for created event.
 * Submit changes when user changed team(for all event types)
 * or submit changes when user add new team(only for inter school event, multiparty).
 * @param activeSchoolId
 * @param binding
 * @returns {*}
 */
function submitAllChanges(activeSchoolId, binding) {
	switch (true) {
		case binding.toJS('teamManagerMode') === 'ADD_TEAM': {
			const	selectedRivalIndex	= binding.toJS('teamManagerWrapper.default.teamModeView.selectedRivalIndex'),
					event				= binding.toJS('model'),
					rival				= binding.toJS(`teamManagerWrapper.default.rivals.${selectedRivalIndex}`),
					teamWrappers		= binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper`),
					teamWrapper			= teamWrappers.find(tw => tw.rivalId === rival.id);

			return TeamHelper
				.createTeam(
					activeSchoolId,
					event,
					rival,
					teamWrapper
				)
				.then(team => {
					return TeamHelper.addTeamsToEvent(
						activeSchoolId,
						event,
						[team]
					);
				});
		}
		case binding.toJS('teamManagerMode') === 'CHANGE_TEAM': {
			return changeTeamNames(activeSchoolId, binding)
				.then(() => commitPlayersChanges(activeSchoolId, binding))
				.then(() => {
					if(EventHelper.isNotFinishedEvent(binding.toJS('model'))) {
						return Promise.resolve(true);
					} else {
						return CorrectScoreActions.correctEventScoreByChanges(activeSchoolId, binding);
					}
				});
		}
	}
};

module.exports.changeTeamNames				= changeTeamNames;
module.exports.commitPlayersChanges			= commitPlayersChanges;
module.exports.submitAllChanges				= submitAllChanges;