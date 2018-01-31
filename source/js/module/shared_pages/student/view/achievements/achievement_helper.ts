export const AchievementHelper = {
	getActiveSchool(event: any, activeSchoolId: string) {
		let activeSchool;

		const inviterSchool = event.inviterSchool;
		if(inviterSchool.id === activeSchoolId) {
			activeSchool = inviterSchool;
		} else {
			const invitedSchools = event.invitedSchools;
			activeSchool = invitedSchools.find(school => school.id === activeSchoolId);
		}

		return activeSchool;
	},
	getSchoolName(event: any, activeSchoolId: string) {
		let schoolName = '';

		const activeSchool = this.getActiveSchool(event, activeSchoolId);
		if(typeof activeSchool !== 'undefined') {
			schoolName = activeSchool.name;
		}

		return schoolName;
	},
	getSortedScoreArray(scores, sport) {
		return scores.sort((score1, score2) => {
			switch (sport.scoring) {
				case 'LESS_SCORES':
				case 'LESS_TIME':
				case 'LESS_RESULT':
					if(score1.score > score2.score) {
						return 1;
					} else if(score1.score < score2.score) {
						return -1;
					} else {
						return 0;
					}
				case 'MORE_SCORES':
				case 'MORE_TIME':
				case 'MORE_RESULT':
				case 'FIRST_TO_N_POINTS':
					if(score1.score < score2.score) {
						return 1;
					} else if(score1.score > score2.score) {
						return -1;
					} else {
						return 0;
					}
			}
		});
	}
};