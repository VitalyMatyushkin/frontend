const	Promise						= require('bluebird'),
		AfterRivalsChangesHelper	= require('./helpers/after_rivals_changes_helper'),
		EventHelper					= require('../../../../helpers/eventHelper'),
		ScoreChangesHelper			= require('../../../../helpers/score/score_changes_helper'),
		TeamHelper					= require('../../../../ui/managers/helpers/team_helper');

const CorrectScoreActions = {
	correctEventScoreByChanges: function(activeSchoolId, binding) {
		const event = binding.toJS('model');

		let promises = [];

		if(TeamHelper.isNonTeamSport(event)) {
			promises = promises.concat(this.correctIndividualScoreByChanges(activeSchoolId, binding));
		} else {
			promises = promises.concat(this.correctTeamScoreByChanges(0, activeSchoolId, binding));
			!EventHelper.isInterSchoolsEvent(event) && (
				promises = promises.concat(this.correctTeamScoreByChanges(1, activeSchoolId, binding))
			);
		}

		return Promise.all(promises);
	},
	correctIndividualScoreByChanges: function(activeSchoolId, binding) {
		const event = binding.toJS('model');

		const	prevPlayers		= AfterRivalsChangesHelper.getCommitPlayersForIndividualEvent(event, binding),
				currentPlayers	= AfterRivalsChangesHelper.getInitPlayersForIndividualEvent(event, binding),
				removedPlayers	= TeamHelper.getRemovedPlayers(prevPlayers, currentPlayers);

		return Promise.all(
			ScoreChangesHelper.correctIndividualScoreByRemovedPlayers(activeSchoolId, event, removedPlayers)
		);
	},
	correctTeamScoreByChanges: function(order, activeSchoolId, binding) {
		let promises = [];

		if(
			AfterRivalsChangesHelper.isSetTeamLaterByOrder(order, binding) &&
			AfterRivalsChangesHelper.isTeamWasDeletedByOrder(order, binding)
		) {
			// Team was deleted and isSetTeamLater was set true.
			// So, we should:
			// 1) Converts team score to school score or houses score it depends on event type.
			// 2) Delete all individual score for removed team.
			// 3) Set IndividualScoreAvailable to false.
			const teamId = AfterRivalsChangesHelper.getPrevTeamIdByOrder(order, binding);
			promises = promises.concat(this.moveTeamScoreToGeneralScoreByTeamId(order, teamId, activeSchoolId, binding));
			promises = promises.concat(this.deleteAllIndividualScoreByTeamId(teamId, activeSchoolId, binding));
			// TODO must implement this. but now, waiting for server.
			//promises = promises.concat(setIndividualScoreAvailableByTeamId(teamId));
		} else if(
			!AfterRivalsChangesHelper.isSetTeamLaterByOrder(order, binding) &&
			AfterRivalsChangesHelper.isTeamWasCreatedByOrder(order, binding)
		) {
			// New team was added to event instead SetTeamsLater.
			// So, we need move school or house scores to new team.
			promises = promises.concat(this.moveGeneralScoreTypeToTeamScoreByOrder(order, activeSchoolId, binding));
		} else if(
			!AfterRivalsChangesHelper.isSetTeamLaterByOrder(order, binding) &&
			AfterRivalsChangesHelper.isTeamChangedByOrder(order, binding)
		) {
			// Team was just changed.
			// 1) Moves team score from prev team to current team
			// 2) Delete all individual score for removed team.
			// 3) Set IndividualScoreAvailable to false.
			const	prevTeamId		= AfterRivalsChangesHelper.getPrevTeamIdByOrder(order, binding),
				currentTeamId	= AfterRivalsChangesHelper.getTeamIdByOrder(order, binding);

			promises = promises.concat(this.moveTeamScoreFromPrevTeamToCurrentTeam(prevTeamId, currentTeamId, activeSchoolId, binding));
			promises = promises.concat(this.deleteAllIndividualScoreByTeamId(prevTeamId, activeSchoolId, binding));
			// TODO must implement this. but now, waiting for server.
			//promises = promises.concat(setIndividualScoreAvailableByTeamId(teamId));
		} else if(
			!AfterRivalsChangesHelper.isSetTeamLaterByOrder(order, binding) &&
			!AfterRivalsChangesHelper.isTeamChangedByOrder(order, binding)
		) {
			// Team players was changed.
			// 1) Corrects team score by depend on player changes. I mean, if player was removed and he has some score points
			// we should delete these points from team score.
			// 2) Corrects individual score by depend on player changes. I mean, if player was removed and he has some score points
			// we should delete these points from individual score.
			const teamId = AfterRivalsChangesHelper.getTeamIdByOrder(order, binding);

			promises = promises.concat(this.correctScoreByRemovedPlayers(order, teamId, activeSchoolId, binding));
		}

		return promises;
	},
	correctScoreByRemovedPlayers: function(order, teamId, activeSchoolId, binding) {
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
	},
	moveTeamScoreFromPrevTeamToCurrentTeam: function(prevTeamId, currentTeamId, activeSchoolId, binding) {
		const	event		= binding.toJS('model'),
				teamScore	= event.result.teamScore;

		return ScoreChangesHelper.moveTeamScoreToOtherTeam(prevTeamId, currentTeamId, activeSchoolId, event.id, teamScore);
	},

	moveTeamScoreToGeneralScoreByTeamId: function(order, teamId, activeSchoolId, binding) {
		const	event	= binding.toJS('model');

		let promises = [];

		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				promises = promises.concat(ScoreChangesHelper.moveTeamScoreToSchoolScoreByEventAndTeamId(activeSchoolId, event, teamId));
				break;
			case EventHelper.isHousesEvent(event):
				const houseId = AfterRivalsChangesHelper.getHouseIdByOrder(order);
				promises = promises.concat(ScoreChangesHelper.moveTeamScoreToHousesScoreByEventAndTeamId(activeSchoolId, houseId, event, teamId));
				break;
		}

		return promises;
	},

	moveGeneralScoreTypeToTeamScoreByOrder: function(order, activeSchoolId, binding) {
		const	event		= binding.toJS('model'),
				newTeamId	= AfterRivalsChangesHelper.getTeamIdByOrder(order);

		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				return ScoreChangesHelper.moveSchoolScoreToTeamScoreBySchoolId(activeSchoolId, event, newTeamId);
			case EventHelper.isHousesEvent(event):
				const houseId = AfterRivalsChangesHelper.getHouseIdByOrder(order);
				return ScoreChangesHelper.moveHouseScoreToTeamScoreByHouseId(activeSchoolId, houseId, event, newTeamId);
		}
	},
	deleteAllIndividualScoreByTeamId(teamId, activeSchoolId, binding) {
		const	event			= binding.toJS('model'),
				individualScore	= event.result.individualScore;

		return ScoreChangesHelper.deleteAllIndividualScoreByTeamId(activeSchoolId, event.id, teamId, individualScore);
	}
};

module.exports.CorrectScoreActions = CorrectScoreActions;