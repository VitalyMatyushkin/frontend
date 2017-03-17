const	ScoreCRUD	= require('./score_crud'),
		Promise		= require('bluebird');

const ScoreChangesHelper = {
	correctTeamScoreByRemovedPlayers: function(schoolId, event, teamId, removedPlayers) {
		const individualScore = event.results.individualScore;

		let removedPlayersScore = 0;

		removedPlayers.forEach(removedPlayer => {
			//TODO check this. i mean has userData userId and permissionId?
			const scoreData = individualScore.find(scoreData =>
				removedPlayer.userId === scoreData.userId && removedPlayer.permissionId === scoreData.permissionId
			);

			if(typeof scoreData !== 'undefined') {
				removedPlayersScore += scoreData.value;
			}
		});

		if(removedPlayersScore !== 0) {
			const	teamScore			= event.results.teamScore.find(scoreData => scoreData.teamId === teamId),
					newTeamScoreValue	= teamScore.value - removedPlayersScore;

			return ScoreCRUD.updateTeamScore(schoolId, event.id, teamScore.id, {value: newTeamScoreValue});
		} else {
			return Promise.resolve(true);
		}
	},
	correctIndividualScoreByRemovedPlayers: function(schoolId, event, removedPlayers) {
		const	individualScore				= event.results.individualScore,
				removedPlayerScorePoints	= [];

		removedPlayers.forEach(removedPlayer => {
			//TODO check this. i mean has userData userId and permissionId?
			const scoreData = individualScore.find(scoreData =>
				removedPlayer.userId === scoreData.userId && removedPlayer.permissionId === scoreData.permissionId
			);

			if(typeof scoreData !== 'undefined') {
				removedPlayerScorePoints.push(scoreData);
			}
		});

		if(removedPlayerScorePoints.length !== 0) {
			return removedPlayers.map(scoreData =>
				ScoreCRUD.deleteIndividualScorePoint(schoolId, event.id, scoreData.id)
			);
		} else {
			return Promise.resolve(true);
		}
	},
	moveTeamScoreToSchoolScoreByEventAndTeamId: function(schoolId, event, teamId) {
		const	score		= event.result.teamScore.find(s => s.teamId === teamId),
				postData	= {
					schoolId:	schoolId,
					score:		score.value
				};

		return ScoreCRUD.addSchoolScore(schoolId, event.id, postData).then(() => {
			return ScoreChangesHelper.deleteTeamScoreByEventAndTeamId(schoolId, event, teamId);
		});
	},
	moveTeamScoreToHousesScoreByEventAndTeamId: function(schoolId, houseId, event, teamId) {
		const	score		= event.result.teamScore.find(s => s.teamId === teamId),
				postData	= {
					houseId:	houseId,
					score:		score.value
				};

		return ScoreCRUD.addHouseScore(schoolId, event.id, postData).then(() => {
			return ScoreChangesHelper.deleteTeamScoreByEventAndTeamId(schoolId, event, teamId);
		});
	},
	deleteTeamScoreByEventAndTeamId: function(schoolId, event, teamId) {
		const scoreId = event.result.teamScore.find(s => s.teamId === teamId).id;

		return ScoreCRUD.deleteTeamScore(schoolId, event.id, scoreId);
	},
	deleteAllIndividualScoreByTeamId: function(schoolId, eventId, teamId, individualScore) {
		const individualScoreFromCurrentTeam = individualScore.filter(scoreData => scoreData.teamId === teamId);

		return individualScoreFromCurrentTeam.map(scoreData => ScoreCRUD.deleteIndividualScorePoint(schoolId, eventId, scoreData.id));
	},
	moveTeamScoreToOtherTeam: function(fromTeamId, toTeamId, schoolId, eventId, teamScore) {
		const	fromTeamScore	= teamScore.find(scoreData => scoreData.teamId === fromTeamId),
				postData		= {
					teamId:	toTeamId,
					score:	fromTeamScore.value
				};

		return this.addTeamScore(schoolId, eventId, toTeamId, postData)
			.then(() => {
				return ScoreCRUD.deleteTeamScore(schoolId, eventId, fromTeamId);
			});
	},
	moveSchoolScoreToTeamScoreBySchoolId: function(fromSchoolId, toTeamId, event) {
		const	eventId			= event.id,
				fromSchoolScore	= event.result.schoolScores.find(scoreData => scoreData.schoolId === fromSchoolId);

		const dataToPost = {
			teamId: toTeamId,
			score: fromSchoolScore.value
		};
		return ScoreCRUD.addTeamScore(fromSchoolId, eventId, dataToPost)
			.then(() => ScoreCRUD.deleteSchoolScore(fromSchoolId, eventId, fromSchoolScore.id));
	},
	moveHouseScoreToTeamScoreByHouseId: function(schoolId, fromHouseId, toTeamId, event) {
		const	eventId			= event.id,
				fromHouseScore	= event.result.houseScore.find(scoreData => scoreData.houseId === fromHouseId);

		const dataToPost = {
			teamId: toTeamId,
			score: fromHouseScore.value
		};
		return ScoreCRUD.addTeamScore(fromHouseId, eventId, dataToPost)
			.then(() => ScoreCRUD.deleteSchoolScore(fromHouseId, eventId, fromHouseScore.id));
	}
};

module.exports = ScoreChangesHelper;