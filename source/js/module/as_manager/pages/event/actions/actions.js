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
			const selectedTeamId =
				binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${selectedRivalIndex}.selectedTeamId`);
			const name =
				binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${selectedRivalIndex}.teamName.name`);

			promises = promises.concat(
				TeamHelper.updateTeam(
					activeSchoolId,
					selectedTeamId,
					{
						name: name
					},
					event.id
				)
			);
		}
	}

	return Promise.all(promises);
}

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
}

/**
 * Submit players changes for individual game
 */
function commitIndividualPlayerChanges(activeSchoolId, binding) {
	const event = binding.toJS('model');

	const	eventId = event.id;
	let		players, initialPlayers;

	if(TeamHelper.isNewEvent(event)) {
		const selectedRivalIndex = binding.toJS('selectedRivalIndex');

		players			= AfterRivalsChangesHelper.getCommitPlayersForIndividualEvent(event, binding, selectedRivalIndex);
		initialPlayers	= AfterRivalsChangesHelper.getInitPlayersForIndividualEvent(event, binding, selectedRivalIndex);
	} else {
		players			= AfterRivalsChangesHelper.getCommitPlayersForIndividualEvent(event, binding);
		initialPlayers	= AfterRivalsChangesHelper.getInitPlayersForIndividualEvent(event, binding);
	}

	return TeamHelper.commitIndividualPlayers(
			activeSchoolId,
			eventId,
			initialPlayers,
			players,
			binding.toJS(`isManualNotificationMode`) ? 'MANUAL' : 'AUTO'
		).then(actionDescriptorId => {
			if(binding.toJS(`isManualNotificationMode`)) {
				binding.set('actionDescriptorId', actionDescriptorId);
			}

			return true;
		})
}

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
				promises = promises.concat(
					changeTeamByOrder(order, activeSchoolId, binding)
				);
			} else {
				promises = promises.concat(
					commitTeamPlayerChangesByOrder(order, activeSchoolId, binding).then(actionDescriptorId => {
						if(binding.toJS(`isManualNotificationMode`)) {
							binding.set('actionDescriptorId', actionDescriptorId);
						}

						return true;
					})
				);
			}
			break;
	}

	return promises;
}

function removePrevSelectedTeamFromEventByOrder(order, activeSchoolId, binding) {
	const prevSelectedTeamId =
		binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`);

	return TeamHelper.deleteTeamFromEvent(
		activeSchoolId,
		binding.toJS('model').id,
		prevSelectedTeamId
	);
}

function changeTeamByOrder(order, activeSchoolId, binding) {
	const team = TeamHelper.createTeam(
		activeSchoolId,
		binding.toJS('model'),
		binding.toJS(`teamManagerWrapper.default.rivals.${order}`),
		binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}`)
	);

	const prevSelectedTeamId =
		binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`);

	let deleteTeamFromEventPromise = true;
	if(typeof prevSelectedTeamId !== 'undefined') {
		deleteTeamFromEventPromise = TeamHelper.deleteTeamFromEvent(
			activeSchoolId,
			binding.toJS('model').id,
			prevSelectedTeamId
		);
	}

	return Promise.resolve(deleteTeamFromEventPromise)
		.then(() => TeamHelper.addTeamsToEvent(
			activeSchoolId,
			binding.toJS('model').id,
			[team],
			binding.toJS(`isManualNotificationMode`) ? 'MANUAL' : 'AUTO'
		))
		.then(data => {
			if(binding.toJS(`isManualNotificationMode`)) {
				binding.set('actionDescriptorId', data[0].actionDescriptorId);
			}

			return data[0].team;
		})
		.then(team => {
			binding.set(
				`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`,
				Immutable.fromJS(team.id)
			);
		});
}

function commitTeamPlayerChangesByOrder(order, activeSchoolId, binding) {
	const tw = binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}`);

	return TeamHelper.commitPlayers(
			tw.prevPlayers,
			tw.___teamManagerBinding.teamStudents,
			tw.selectedTeamId,
			activeSchoolId,
			binding.toJS('model').id,
			binding.toJS(`isManualNotificationMode`) ? 'MANUAL' : 'AUTO'
		);
}

/**
 * This function only for created event.
 * Submit changes when user changed team(for all event types)
 * or submit changes when user add new team(only for inter school event, multiparty).
 * @param activeSchoolId
 * @param binding
 * @returns {*}
 */
function submitAllChanges(activeSchoolId, binding) {
	switch ( binding.toJS('teamManagerMode') ) {
		case 'ADD_TEAM': {
			console.log('ADD TEAM');
			const	selectedRivalIndex	= binding.toJS('teamManagerWrapper.default.teamModeView.selectedRivalIndex'),
					event				= binding.toJS('model'),
					rival				= binding.toJS(`teamManagerWrapper.default.rivals.${selectedRivalIndex}`),
					teamWrappers		= binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper`),
					teamWrapper			= teamWrappers.find(tw => tw.rivalId === rival.id);

			const team = TeamHelper.createTeam(
				activeSchoolId,
				event,
				rival,
				teamWrapper
			);

			return TeamHelper.addTeamsToEvent(
					activeSchoolId,
					event.id,
					[team],
					binding.toJS(`isManualNotificationMode`) ? 'MANUAL' : 'AUTO'
				)
				.then(data => {
					if(binding.toJS(`isManualNotificationMode`)) {
						binding.set('actionDescriptorId', data[0].actionDescriptorId);
					}

					return true;
				});
		}
		case 'CHANGE_TEAM': {
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
}

function submitGroupChanges(activeSchoolId, binding) {
	const 	event 	= binding.toJS('model'),
			eventId = event.id;
	
	switch ( binding.toJS('teamManagerMode') ) {
		case 'CHANGE_TEAM': {
			const players = AfterRivalsChangesHelper.getTeamPlayersByOrder(0, binding);

			const playersCommit = players.map(player => {
				return {
					userId: 		typeof player.userId !== 'undefined' ? player.userId : player.id ,
					permissionId: 	player.permissionId
				}
			});
			

			return window.Server.schoolEventIndividualsGroupBatch.post({schoolId: activeSchoolId, eventId: eventId}, {participants: playersCommit});
		}
		default:
			console.error('teamManagerMode is not valid');
			break;
	}
}



module.exports.changeTeamNames		= changeTeamNames;
module.exports.commitPlayersChanges	= commitPlayersChanges;
module.exports.submitAllChanges		= submitAllChanges;
module.exports.submitGroupChanges	= submitGroupChanges;