const ChallengeModelHelper = {
	getSortedScoreArrayForInterSchoolsMultipartyTeamEvent: function(event) {
		const	teamsData = event.teamsData,
				teamScore = event.results.teamScore;

		teamScore.forEach(teamScoreData => {
			const team = teamsData.find(t => t.id === teamScoreData.teamId);

			teamScoreData.schoolId = team.schoolId;
		});

		let score = teamScore.concat(event.results.schoolScore);

		score = score.sort((scoreData1, scoreData2) => {
			if(scoreData1.score > scoreData2.score) {
				return -1;
			}
			if(scoreData1.score < scoreData2.score) {
				return 1;
			}

			return 0;
		});

		return score
	},
	getSortedPlaceArrayForInterSchoolsMultipartyTeamEvent: function(event) {
		const places = [];

		const scoreArray = this.getSortedScoreArrayForInterSchoolsMultipartyTeamEvent(event);

		if(scoreArray.length !== 0) {
			let currentScoreValue = scoreArray[0].score;
			for(let i = 0; i < scoreArray.length; i++) {
				if(currentScoreValue === scoreArray[i].score) {
					const placeIndex = places.findIndex(p => p.score === currentScoreValue);

					if(placeIndex !== -1) {
						places[placeIndex].schoolIds.push(scoreArray[i].schoolId);
					} else {
						places.push({
							place:		places.length + 1,
							score:		scoreArray[i].score,
							schoolIds:	[scoreArray[i].schoolId]
						});
					}
				} else {
					currentScoreValue = scoreArray[i].score;
					places.push({
						place:		places.length + 1,
						score:		scoreArray[i].score,
						schoolIds:	[scoreArray[i].schoolId]
					});
				}
			}
		}

		return places;
	}
} ;

module.exports = ChallengeModelHelper;