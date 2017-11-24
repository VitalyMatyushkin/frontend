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
		if (Array.isArray(teamsData)) {
			const 	team 	= teamsData.find(team => team.schoolId === schoolId),
					teamId 	= propz.get(team, ['id']);
			
			const teamsScore = propz.get(event, ['results', 'teamScore']);
			if (Array.isArray(teamsScore)) {
				const 	teamScore 	= teamsScore.find(team => team.teamId === teamId),
						isWinner 	= propz.get(teamScore, ['isWinner']);
				return isWinner ? 1 : 0;
			}
		} else {
			console.log('teamsData is not array!');
			return 0;
		}
	},
	
	getLoseGame: function(schoolId, event){
		const teamsData = propz.get(event, ['teamsData']);
		if (Array.isArray(teamsData)) {
			const 	team 	= teamsData.find(team => team.schoolId === schoolId),
					teamId 	= propz.get(team, ['id']);
			
			const teamsScore = propz.get(event, ['results', 'teamScore']);
			if (Array.isArray(teamsScore)) {
				const 	teamScore 			= teamsScore.find(team => team.teamId !== teamId),
						isWinnerOpponent 	= propz.get(teamScore, ['isWinner']);
				return isWinnerOpponent ? 1 : 0;
			}
		} else {
			console.log('teamsData is not array!');
			return 0;
		}
	},
	
	getDrawGame: function(schoolId, event){
		const 	teamsScore 	= propz.get(event, ['results', 'teamScore']),
				isWinner1 	= propz.get(teamsScore, ['0', 'isWinner'], true),
				isWinner2 	= propz.get(teamsScore, ['1', 'isWinner'], true);
		
		return !isWinner1 && !isWinner2 ? 1 : 0;
	},
	
	getPlayGame: function(event){
		const status = propz.get(event, ['status']);
		return status === 'FINISHED' ? 1 : 0;
	},
	
	getPoints: function(winGame, drawGame, loseGame){
		return winGame * 3 + drawGame * 2 + loseGame
	},
	
	getGF: function(schoolId, event){
		const teamsData = propz.get(event, ['teamsData']);
		if (Array.isArray(teamsData)) {
			const 	team 	= teamsData.find(team => team.schoolId === schoolId),
				teamId 	= propz.get(team, ['id']);
			
			const teamsScore = propz.get(event, ['results', 'teamScore']);
			if (Array.isArray(teamsScore)) {
				const 	teamScore 	= teamsScore.find(team => team.teamId === teamId);
				
				let gf;
				
				if (typeof teamScore === 'undefined') {
					gf = propz.get(event, ['results','schoolScore', '0', 'score'], 0);
				} else {
					gf 			= propz.get(teamScore, ['score'], 0);
				}
				
				return Number(gf);
			}
		} else {
			console.log('teamsData is not array!');
			return 0;
		}
	},
	
	getGA: function(schoolId, event){
		const teamsData = propz.get(event, ['teamsData']);
		if (Array.isArray(teamsData)) {
			const 	team 	= teamsData.find(team => team.schoolId === schoolId),
				teamId 	= propz.get(team, ['id']);
			
			const teamsScore = propz.get(event, ['results', 'teamScore']);
			if (Array.isArray(teamsScore)) {
				const 	teamScore 	= teamsScore.find(team => team.teamId !== teamId);
				
				let ga;
				
				if (typeof teamScore === 'undefined') {
					ga = propz.get(event, ['results','schoolScore', '0', 'score'], 0);
				} else {
					ga 			= propz.get(teamScore, ['score'], 0);
				}
				return Number(ga);
			}
		} else {
			console.log('teamsData is not array!');
			return 0;
		}
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