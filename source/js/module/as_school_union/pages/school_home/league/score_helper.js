/**
 * Created by vitaly on 23.11.17.
 */
const propz = require('propz');

const ScoreHelper = {
	/**
	 * Get school name from event object
	 * @param {String} schoolId
	 * @param {Object} event
	 */
	getSchoolNameFromEvent: function(schoolId, event){
		return event.invitedSchools.filter(invitedSchool => invitedSchool.id === schoolId)[0].name;
	},
	
	getWinGame: function(schoolId, event){
		const teamsData = propz.get(event, ['teamsData']);
		if (Array.isArray(teamsData) && teamsData.length !== 0) {
			const 	team 	= teamsData.find(team => team.schoolId === schoolId),
					teamId 	= propz.get(team, ['id']);
			
			const teamsScore = propz.get(event, ['results', 'teamScore']);
			if (Array.isArray(teamsScore)) {
				const 	teamScore 	= teamsScore.find(team => team.teamId === teamId),
						isWinner 	= propz.get(teamScore, ['isWinner']);
				return isWinner ? 1 : 0;
			}
		} else {
			const schoolsScore = propz.get(event, ['results', 'schoolScore']);
			if (Array.isArray(schoolsScore)) {
				const 	schoolScore 	= schoolsScore.find(school => school.schoolId === schoolId),
						isWinner 		= propz.get(schoolScore, ['isWinner']);
				return isWinner ? 1 : 0;
			}
		}
	},
	
	getLoseGame: function(schoolId, event){
		const teamsData = propz.get(event, ['teamsData']);
		if (Array.isArray(teamsData)  && teamsData.length !== 0) {
			const 	team 	= teamsData.find(team => team.schoolId === schoolId),
					teamId 	= propz.get(team, ['id']);
			
			const teamsScore = propz.get(event, ['results', 'teamScore']);
			if (Array.isArray(teamsScore)) {
				const 	teamScore 			= teamsScore.find(team => team.teamId !== teamId),
						isWinnerOpponent 	= propz.get(teamScore, ['isWinner']);
				return isWinnerOpponent ? 1 : 0;
			}
		} else {
			const schoolsScore = propz.get(event, ['results', 'schoolScore']);
			if (Array.isArray(schoolsScore)) {
				const 	schoolScore 		= schoolsScore.find(school => school.schoolId !== schoolId),
						isWinnerOpponent 	= propz.get(schoolScore, ['isWinner']);
				return isWinnerOpponent ? 1 : 0;
			}
		}
	},
	
	getDrawGame: function(schoolId, event){
		const teamsData = propz.get(event, ['teamsData']);
		if (Array.isArray(teamsData)  && teamsData.length !== 0) {
			const 	teamsScore = propz.get(event, ['results', 'teamScore']),
					isWinner1 = propz.get(teamsScore, ['0', 'isWinner'], true),
					isWinner2 = propz.get(teamsScore, ['1', 'isWinner'], true);
			
			return !isWinner1 && !isWinner2 ? 1 : 0;
		} else {
			const 	schoolScore = propz.get(event, ['results', 'schoolScore']),
					isWinner1 = propz.get(schoolScore, ['0', 'isWinner'], true),
					isWinner2 = propz.get(schoolScore, ['1', 'isWinner'], true);
			
			return !isWinner1 && !isWinner2 ? 1 : 0;
		}
	},
	
	getPlayGame: function(event){
		const status = propz.get(event, ['status']);
		return status === 'FINISHED' ? 1 : 0;
	},
	
	getPoints: function(winGame, drawGame, loseGame){
		return winGame * 3 + drawGame * 2 + loseGame
	},
	
	getGF: function(schoolId, event){
		let gf = 0;

		const teamsData = propz.get(event, ['teamsData']);
		if (Array.isArray(teamsData)) {
			const team = teamsData.find(team => team.schoolId === schoolId);
			const teamId = propz.get(team, ['id']);

			// Find team score
			const teamsScoreArray = propz.get(event, ['results', 'teamScore']);
			const teamScore = Array.isArray(teamsScoreArray) ?
				teamsScoreArray.find(teamScore => teamScore.teamId === teamId):
				undefined;

			// Find school score
			const schoolScoreArray = propz.get(event, ['results', 'schoolScore']);
			const schoolScore = Array.isArray(schoolScoreArray) ?
				schoolScoreArray.find(schoolScore => schoolScore.schoolId === schoolId):
				undefined;

			// Set score by priority
			switch (true) {
				case typeof teamScore !== 'undefined':
					gf = Number(teamScore.score);
					break;
				case typeof schoolScore !== 'undefined':
					gf = Number(schoolScore.score);
					break;
				default:
					gf = 0;
					break;
			}
		}

		return gf;
	},

	// Against getGF method we find opponents score
	// So use team.schoolId !== schoolId
	// and schoolScore.schoolId !== schoolId
	getGA: function(schoolId, event) {
		let ga = 0;

		const teamsData = propz.get(event, ['teamsData']);
		if (Array.isArray(teamsData)) {
			const team = teamsData.find(team => team.schoolId !== schoolId);
			const teamId = propz.get(team, ['id']);

			// Find team score
			const teamsScoreArray = propz.get(event, ['results', 'teamScore']);
			const teamScore = Array.isArray(teamsScoreArray) ?
				teamsScoreArray.find(teamScore => teamScore.teamId === teamId):
				undefined;

			// Find school score
			const schoolScoreArray = propz.get(event, ['results', 'schoolScore']);
			const schoolScore = Array.isArray(schoolScoreArray) ?
				schoolScoreArray.find(schoolScore => schoolScore.schoolId !== schoolId):
				undefined;

			// Set score by priority
			switch (true) {
				case typeof teamScore !== 'undefined':
					ga = Number(teamScore.score);
					break;
				case typeof schoolScore !== 'undefined':
					ga = Number(schoolScore.score);
					break;
				default:
					ga = 0;
					break;
			}
		}

		return ga;
	},
	
	getGD: function(gf, ga){
		return gf - ga
	},
	
	getTeamName: function(schoolId, event){
		const teamsData = propz.get(event, ['teamsData']);
		if (Array.isArray(teamsData)) {
			const 	team 		= teamsData.find(team => team.schoolId === schoolId),
				teamName 	= propz.get(team, ['name'], '');
			
			return teamName;
		} else {
			console.log('teamsData is not array!');
			return '';
		}
	},
	
	/**
	 * Return array with unique elements
	 * @param {Array} arr
	 * @returns {Array}
	 */
	uniqueArray: function(arr) {
		let obj = {};
		
		for (let i = 0; i < arr.length; i++) {
			let str = arr[i];
			obj[str] = arr[i];
		}
		
		return Object.keys(obj).map(key => obj[key]);
	}
};

module.exports = ScoreHelper;
