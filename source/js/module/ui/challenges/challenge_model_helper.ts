import {Event} from 'module/as_manager/pages/events/events';

export class ChallengeModelHelper {
	static getSortedScoreArrayForInterSchoolsMultipartyTeamEvent (event: Event) {
		const	teamsData = event.teamsData,
				teamScore = event.results.teamScore;

		teamScore.forEach(teamScoreData => {
			const team = teamsData.find(t => t.id === teamScoreData.teamId);

			teamScoreData.schoolId = team.schoolId;
		});

		let score = teamScore.concat(event.results.schoolScore);

		score = score.sort((scoreData1, scoreData2) => {
			switch (event.sport.scoring) {
				case 'LESS_SCORES':
				case 'LESS_TIME':
				case 'LESS_RESULT':
					if(scoreData1.score < scoreData2.score) {
						return -1;
					} else if(scoreData1.score > scoreData2.score) {
						return 1;
					} else {
						return 0;
					}
				case 'MORE_SCORES':
				case 'MORE_TIME':
				case 'MORE_RESULT':
				case 'FIRST_TO_N_POINTS':
					if(scoreData1.score < scoreData2.score) {
						return 1;
					} else if(scoreData1.score > scoreData2.score) {
						return -1;
					} else {
						return 0;
					}
			}
		});

		return score;
	}

	static getSortedPlaceArrayForInterSchoolsMultipartyTeamEvent (event: Event) {
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
}