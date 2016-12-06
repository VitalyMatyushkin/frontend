const	Immutable	= require('immutable'),
		Promise		= require('bluebird'),

		EventHelper	= require('../../../../helpers/eventHelper'),
		TeamHelper	= require('../../../../ui/managers/helpers/team_helper');

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
function commitChanges(activeSchoolId, binding) {
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

function isTeamWasDeletedByOrder(order, binding) {
	return (
		typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`) !== 'undefined' &&
		typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`) === 'undefined'
	);
};

function changeTeamByOrder(order, activeSchoolId, binding) {
	return TeamHelper.createTeam(
			activeSchoolId,
			binding.toJS('model'),
			binding.toJS(`teamManagerWrapper.default.rivals.${order}`),
			binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}`)
		)
		.then(team => TeamHelper.addTeamsToEvent(
			activeSchoolId,
			binding.toJS('model'),
			[team]
		))
		.then(() => {
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

module.exports.changeTeamNames				= changeTeamNames;
module.exports.isSetTeamLaterByOrder		= isSetTeamLaterByOrder;
module.exports.isTeamChangedByOrder			= isTeamChangedByOrder;
module.exports.isNameTeamChangedByOrder		= isNameTeamChangedByOrder;
module.exports.commitChanges				= commitChanges;