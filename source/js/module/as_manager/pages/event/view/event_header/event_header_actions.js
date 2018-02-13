/**
 * Created by Woland on 11.01.2017.
 */
const 	Immutable 			= require('immutable'),
	TeamHelper			= require('module/ui/managers/helpers/team_helper'),
	EventHelper			= require('module/helpers/eventHelper'),
	SportHelper			= require('module/helpers/sport_helper'),
	Promise				= require('bluebird');

const converter = require('json-2-csv');

function downloadPdf(schoolId, eventId, event) {
	/*
	 * Currently there is no one good way (or even just a way) to download file with JS.
	 * So, I disable server-side authorization for this method and just opening new window
	 * with proper link. Not very clever solution, but..
	 *
	 * Also, there is only one template available, so handling that case too
	 * Upd 13/02/2018: Now generate all types of events
	 */
	
	const url = window.apiBase + `/i/schools/${schoolId}/events/${eventId}/pdf`;
	window.open(url);
	
}
function downloadCSV(schoolId, event) {
	let players = TeamHelper.getPlayers(schoolId, event);

	const filteredPlayers = players.map(p => {
		return getCSVPlayer(
			p.firstName,
			p.lastName,
			p.form.name,
			typeof p.form.ageGroup !== 'undefined' ?
				p.form.ageGroup :
				'',
			event.generatedNames[schoolId]
		);
	});

	converter.json2csv(filteredPlayers, (err, csv) => {
		if (err) throw err;

		/*global Blob:true*/
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		if (window.navigator.msSaveBlob) { // IE 10+
			window.navigator.msSaveBlob(blob, 'file.csv');
		} else {
			const link = document.createElement("a");
			if (link.download !== undefined) { // feature detection
				// Browsers that support HTML5 download attribute
				/*global URL:true*/
				const url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", 'file.csv');
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	});
}

function getCSVPlayer(firstName, lastName, form, ageGroup, event) {
	return {
		firstName,
		lastName,
		form,
		ageGroup,
		event
	};
}

function cancelEvent(schoolId, eventId, notificationMode, binding) {
	return window.Server.eventCancel.post(
		{
			schoolId:	schoolId,
			eventId:	eventId
		},
		{
			options: {
				headers:	{ 'notification-mode': notificationMode },
				isDataOnly:	false
			}
		}
		)
		.then(response => {
			if(notificationMode === 'MANUAL') {
				const actionDescriptorId = response.xhr.getResponseHeader('action-descriptor-id');

				return window.Server.actionDescriptor.get({actionDescriptorId: actionDescriptorId}).then(actionDescriptor => {
					actionDescriptor.affectedUserList = convertAffectedUsersToClient(actionDescriptor.affectedUserList);

					binding.set('actionDescriptor', Immutable.fromJS(actionDescriptor));
					binding.set('isOpenCancelEventPopupPopup', false);
					binding.set('isOpenCancelEventManualNotificationPopup', true);

					return true;
				});
			} else {
				document.location.hash = 'events/calendar';

				return true;
			}
		});
}

function convertAffectedUsersToClient(affectedUsers) {
	return affectedUsers.map(_affectedUser => {
		const affectedUser = Object.assign({checked: true}, _affectedUser);

		return affectedUser;
	});
}

function commitUsersToActionDescriptorChanges(actionDescriptorId, users) {
	return window.Server.actionDescriptor.put(
		{
			actionDescriptorId: actionDescriptorId
		}, {
			usersToNotifyList: users.filter(user => user.checked)
		}
		)
		.then(() => {
			document.location.hash = 'events/calendar';

			return true;
		});
}

function setModeClosing(binding) {
	binding.set('mode', 'closing');
}

function setModeGeneral(binding){
	binding.set('mode', 'general');
}

/**
 * Set init state of score. See to component will mount function of Event React Component.
 */
function revertScore(binding) {
	const updEvent = binding.toJS('model');

	updEvent.results = updEvent.initResults;
	updEvent.initResults = undefined;
	binding.set('model', Immutable.fromJS(updEvent));
}

function submitScore(activeSchoolId, event, binding) {
	if(TeamHelper.isNonTeamSport(event)) {
		return submitResultsForIndividualSport(activeSchoolId, event)
			.then(() => doActionsAfterCloseEvent(activeSchoolId, event, binding));
	} else {
		return submitResultsForTeamsSport(activeSchoolId, event)
			.then(() => doActionsAfterCloseEvent(activeSchoolId, event, binding));
	}
}

function submitResultsForIndividualSport(activeSchoolId, event) {
	return submitSchoolResults(activeSchoolId, event)
		.then(() => submitHouseResults(activeSchoolId, event))
		.then(() => submitIndividualResults(activeSchoolId, event));
}

function submitResultsForTeamsSport(activeSchoolId, event){
	return submitSchoolResults(activeSchoolId, event)
		.then(() => submitHouseResults(activeSchoolId, event))
		.then(() => submitTeamResults(activeSchoolId, event))
		.then(() => submitIndividualResults(activeSchoolId, event))
		.then(() => submitCricketResults(activeSchoolId, event));
}

function submitSchoolResults(activeSchoolId, event){
	const body = event.results.schoolScore;

	switch (true) {
		case body.length === 1:
			let newIsWinnerValue;
			if(TeamHelper.isOneOnOneSport(event)) {
				newIsWinnerValue = event.results.schoolScore[0].score > event.results.individualScore[0].score ? true : false;
			} else {
				newIsWinnerValue = event.results.schoolScore[0].score > event.results.teamScore[0].score ? true : false;
			}
			body[0].isWinner = newIsWinnerValue;
			break;
		case body.length === 2 && body[0].score > body[1].score:
			body[0].isWinner = true;
			body[1].isWinner = false;
			break;
		case body.length === 2 && body[0].score < body[1].score:
			body[0].isWinner = false;
			body[1].isWinner = true;
			break;
		case body.length === 2 && body[0].score === body[1].score:
			body[0].isWinner = false;
			body[1].isWinner = false;
			break;
	}

	if(body.length !== 0) {
		let promises = [];

		promises = promises.concat(
			body
				.filter(scoreData => isNewResultItem(scoreData))
				.map(scoreData => window.Server.schoolEventResultSchoolScores.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData))
		);

		promises = promises.concat(
			body
				.filter(scoreData => !isNewResultItem(scoreData))
				.map(
					scoreData => window.Server.schoolEventResultSchoolScore.put(
						{
							schoolId	: activeSchoolId,
							eventId		: event.id,
							scoreId		: scoreData._id
						},
						scoreData
					)
				)
		);

		return Promise.all(promises);
	} else {
		return Promise.resolve(true);
	}
}

function submitHouseResults(activeSchoolId, event) {
	const score = event.results.houseScore;

	switch (true) {
		case score.length === 1:
			let newIsWinnerValue;
			if(TeamHelper.isOneOnOneSport(event)) {
				newIsWinnerValue = event.results.houseScore[0].score > event.results.individualScore[0].score ? true : false;
			} else {
				newIsWinnerValue = event.results.houseScore[0].score > event.results.teamScore[0].score ? true : false;
			}
			score[0].isWinner = newIsWinnerValue;
			break;
		case score.length === 2 && score[0].score > score[1].score:
			score[0].isWinner = true;
			score[1].isWinner = false;
			break;
		case score.length === 2 && score[0].score < score[1].score:
			score[0].isWinner = false;
			score[1].isWinner = true;
			break;
		case score.length === 2 && score[0].score === score[1].score:
			score[0].isWinner = false;
			score[1].isWinner = false;
			break;
	}

	if(score.length !== 0) {
		let promises = [];

		promises = promises.concat(
			score
				.filter(scoreData => isNewResultItem(scoreData))
				.map(scoreData => window.Server.schoolEventResultHousesScores.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData))
		);

		promises = promises.concat(
			score
				.filter(scoreData => !isNewResultItem(scoreData))
				.map(
					scoreData => window.Server.schoolEventResultHousesScore.put(
						{
							schoolId	: activeSchoolId,
							eventId		: event.id,
							scoreId		: scoreData._id
						},
						scoreData
					)
				)
		);

		return Promise.all(promises);
	} else {
		return Promise.resolve(true);
	}
}

function submitTeamResults(activeSchoolId, event) {
	const score = event.results.teamScore;

	switch (true) {
		case score.length === 1:
			const opponentScore = (event.results.schoolScore && event.results.schoolScore.length) ?
				event.results.schoolScore[0].score :
				event.results.houseScore[0].score;

			const newIsWinnerValue = opponentScore > event.results.teamScore[0].score;
			score[0].isWinner = newIsWinnerValue;
			break;
		case score.length === 2 && score[0].score > score[1].score:
			score[0].isWinner = true;
			score[1].isWinner = false;
			break;
		case score.length === 2 && score[0].score < score[1].score:
			score[0].isWinner = false;
			score[1].isWinner = true;
			break;
		case score.length === 2 && score[0].score === score[1].score:
			score[0].isWinner = false;
			score[1].isWinner = false;
			break;
	}

	if(score.length !== 0) {
		let promises = [];

		promises = promises.concat(
			score
				.filter(scoreData => isNewResultItem(scoreData))
				.map(scoreData => window.Server.schoolEventResultTeamScores.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData))
		);

		promises = promises.concat(
			score
				.filter(scoreData => !isNewResultItem(scoreData))
				.map(
					scoreData => window.Server.schoolEventResultTeamScore.put(
						{
							schoolId	: activeSchoolId,
							eventId		: event.id,
							scoreId		: scoreData._id
						},
						scoreData
					)
				)
		);

		return Promise.all(promises);
	} else {
		return Promise.resolve(true);
	}
}

function submitIndividualResults(activeSchoolId, event) {
	const score = event.results.individualScore;

	let promises = [];

	if(TeamHelper.isOneOnOneSport(event)) {
		switch (true) {
			case score.length === 1 && EventHelper.isInterSchoolsEvent(event):
				score[0].isWinner = score[0].score > event.results.schoolScore[0].score;
				score[0].isChanged = true;
				break;
			case score.length === 1 && EventHelper.isHousesEvent(event):
				score[0].isWinner = score[0].score > event.results.houseScore[0].score;
				score[0].isChanged = true;
				break;
			case score.length === 2:
				score[0].isWinner = score[0].score > score[1].score;
				score[1].isWinner = score[0].score < score[1].score;
				score[0].isChanged = true;
				score[1].isChanged = true;
				break;
		}
	}

	promises = promises.concat(
		score
			.filter(scoreData => typeof scoreData.score !== 'undefined' && isNewResultItem(scoreData))
			.map(scoreData => window.Server.schoolEventResultIndividualsScores.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData))
	);

	promises = promises.concat(
		score
			.filter(scoreData => typeof scoreData.score !== 'undefined' && isResultItemChanged(scoreData))
			.map(
				scoreData => window.Server.schoolEventResultIndividualsScore.put(
					{
						schoolId	: activeSchoolId,
						eventId		: event.id,
						scoreId		: scoreData._id
					},
					scoreData
				)
			)
	);

	promises = promises.concat(
		event.individualScoreForRemove.map(
			scoreData => window.Server.schoolEventResultIndividualsScore.delete(
				{
					schoolId	: activeSchoolId,
					eventId		: event.id,
					scoreId		: scoreData._id
				}
			)
		)
	);

	return Promise.all(promises);
}

function submitCricketResults(activeSchoolId, event) {
	if (SportHelper.isCricket(event.sport.name)) {
		const cricketTextResult = typeof event.results.cricketResult !== 'undefined' ? event.results.cricketResult.result.toUpperCase() : 'TBD';
		const cricketResult = {
			result: cricketTextResult
		};

		if (typeof event.results.cricketResult !== 'undefined' && event.results.cricketResult.who !== '') {
			cricketResult.who = event.results.cricketResult.who
		}

		let promises = [];

		promises = promises.concat(
			window.Server.schoolEventResultCricket.post({
				schoolId: activeSchoolId,
				eventId: event.id
			}, cricketResult)
		);

		return Promise.all(promises);
	} else {
		return Promise.resolve(true);
	}
}

function isNewResultItem(resultItem) {
	return typeof resultItem._id === 'undefined';
}

function isResultItemChanged(resultItem) {
	return !isNewResultItem(resultItem) && resultItem.isChanged;
}

/**
 * Get updated event from server
 * And update result and status
 * Also got event editing page to GENERAL mode
 */
function doActionsAfterCloseEvent(activeSchoolId, event, binding){

	// Get updated event from server, and update some data in binding.
	// 1) Set new results, it's important, because server results contain id's of each result point and event component
	// detect's old result points by these features. If result point doesn't have id, then it's new result point.
	// 2) Set new event status.
	return window.Server.schoolEvent.get( { schoolId: activeSchoolId, eventId: event.id } )
		.then(updEvent => {
			binding
				.atomically()
				.set('model.results',	Immutable.fromJS(updEvent.results))
				.set('model.status',	Immutable.fromJS(updEvent.status))
				.set('mode',			Immutable.fromJS('general'))
				.commit();

			// yep i'm always true
			return true;
		});
}

/**
 * Event closing process started after click save button
 */
function closeMatch(activeSchoolId, event, binding){
	let promises = [];
	if(TeamHelper.isNonTeamSport(event)) {
		promises = promises.concat(
			closeMatchForIndividualSport(activeSchoolId, event, binding)
		);
	} else {
		promises = promises.concat(
			closeMatchForTeamsSport(activeSchoolId, event, binding)
		);
	}

	// match report save
	promises = promises.concat(
		submitMatchReport(activeSchoolId, event)
	);

	return Promise.all(promises);
}

/**
 * Event closing process for individual sport
 */
function closeMatchForIndividualSport(activeSchoolId, event, binding) {

	return window.Server.finishSchoolEvent.post({
			schoolId:	activeSchoolId,
			eventId:	event.id
		})
		.then(() => submitResultsForIndividualSport(activeSchoolId, event))
		.then(() => doActionsAfterCloseEvent(activeSchoolId, event, binding));
}

/**
 * Event closing process for team sport
 */
function closeMatchForTeamsSport(activeSchoolId, event, binding) {

	return window.Server.finishSchoolEvent.post({
			schoolId:	activeSchoolId,
			eventId:	event.id
		})
		.then(() => submitResultsForTeamsSport(activeSchoolId, event))
		.then(() => doActionsAfterCloseEvent(activeSchoolId, event, binding));
}

/**Save match report
 * @param {object} event
 * @returns {Promise} schoolEventReport promise
 * */
function submitMatchReport(activeSchoolId, event){

	return window.Server.schoolEventReport.put({
			schoolId:	activeSchoolId,
			eventId:	event.id
		},
		{
			content: event.matchReport
		}
	);
}

function reportNotParticipate(event){

	return window.Server.children.get().then(children => {
		const activeChildren = [];

		if(TeamHelper.isTeamSport(event)) {
			children.forEach(child => {
				for(let i = 0; i < event.teamsData.length; i++) {
					const player = event.teamsData[i].players.find(p => p.userId === child.id && p.permissionId === child.permissionId);
					if(typeof player !== 'undefined') {
						activeChildren.push(child);
						break;
					}
				}
			});
		} else {
			children.forEach(child => {
				const player = event.individualsData.find(p => p.userId === child.id && p.permissionId === child.permissionId);

				if(typeof player !== 'undefined') {
					activeChildren.push(child);
				}
			});
		}

		return activeChildren.map(child => {
			return window.Server.childrenEventParticipationRefuse.post(
				{
					eventId:		event.id,
					playerDetails:	{
						userId:			child.id,
						permissionId:	child.permissionId
					}
				}
			);
		});
	});
}

function sendConsentRequest(schoolId, eventId) {
	return window.Server.sendInvitationMessagesForEvent.post(
		{
			schoolId:	schoolId,
			eventId:	eventId
		}
	);
}

function deleteEvent(schoolId, eventId){
	return window.Server.schoolEvent.delete(
		{
			schoolId:	schoolId,
			eventId:	eventId
		}
	);
}

function deleteGroupEvents(schoolId, eventId){
	return window.Server.schoolEventGroup.delete(
		{
			schoolId:	schoolId,
			eventId:	eventId
		}
	);
}

module.exports.downloadPdf 							= downloadPdf;
module.exports.cancelEvent 							= cancelEvent;
module.exports.commitUsersToActionDescriptorChanges	= commitUsersToActionDescriptorChanges;
module.exports.setModeClosing 						= setModeClosing;
module.exports.setModeGeneral 						= setModeGeneral;
module.exports.revertScore 							= revertScore;
module.exports.submitScore 							= submitScore;
module.exports.closeMatch 							= closeMatch;
module.exports.reportNotParticipate 				= reportNotParticipate;
module.exports.downloadCSV 							= downloadCSV;
module.exports.sendConsentRequest 					= sendConsentRequest;
module.exports.deleteEvent 							= deleteEvent;
module.exports.deleteGroupEvents 					= deleteGroupEvents;
module.exports.convertAffectedUsersToClient 	    = convertAffectedUsersToClient;