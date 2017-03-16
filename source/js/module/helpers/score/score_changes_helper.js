const	ScoreCRUD	= require('./score_crud'),
		Promise		= require('bluebird');

const ScoreChangesHelper = {
	//TODO need correct implementation
	deleteNonExistentIndividualScore: function(schoolId, eventId, teamId, initialPlayers, players) {
		const promises = [];

		initialPlayers.forEach(initialPlayer =>
			// If player wasn't find - add delete promise to promise array
			!Lazy(players).findWhere({id:initialPlayer.id}) &&
			promises.push(
				this.deleteIndividualScorePoint(
					schoolId,
					eventId,
					initialPlayer.id
				)
			)
		);

		return promises;
	},
	correctTeamScoreByRemovedPlayers: function(schoolId, event, removedPlayers) {
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
	convertTeamScoreToSchoolScoreByEventAndTeamId: function(schoolId, event, teamId) {
		const	score		= event.result.teamScore.find(s => s.teamId === teamId),
				postData	= {
					schoolId:	schoolId,
					score:		score.value
				};

		return ScoreCRUD.addSchoolScore(schoolId, event.id, postData);
	},
	convertTeamScoreToHousesScoreByEventAndTeamId: function(schoolId, event, teamId) {
		const	score		= event.result.teamScore.find(s => s.teamId === teamId),
		//TODO need houseID
				postData	= {
					houseId:	houseId,
					score:		score.value
				};

		return ScoreCRUD.addHouseScore(schoolId, event.id, postData);
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
	}
};

module.exports = ScoreChangesHelper;