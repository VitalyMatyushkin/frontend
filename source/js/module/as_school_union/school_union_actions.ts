/**
 * Created by vitaly on 11.12.17.
 */

import * as leagueSports from 'module/as_school_union/pages/school_home/league/league_sports_helper';
import * as Immutable from 'immutable';
import * as ScoreHelper from 'module/as_school_union/pages/school_home/league/score_helper';

export class SchoolUnionActions {
	static getTournaments(binding, schoolUnionId) {
		(window as any).Server.publicTournaments.get({schoolUnionId})
			.then(tournaments => {
				const tournamentsWithLink = tournaments.filter(tournament => typeof tournament.link !== 'undefined');
				binding.sub('schoolHomePage')
					.atomically()
					.set('tournamentsIsSync', true)
					.set('tournaments', Immutable.fromJS(tournamentsWithLink))
					.set('tournamentsShow', tournamentsWithLink.length > 0)
					.commit();
			});
	}
	
	static getLeagueEvents(binding, activeSchoolId) {
		const filterSport = {
			filter: {
				limit: 1000,
				where: {
					$or: []
				}
			}
		};
		
		leagueSports.forEach(sport => filterSport.filter.where.$or.push({name: sport}));
		
		(window as any).Server.publicSchoolSports.get(activeSchoolId, filterSport)
			.then(sports => {
				const 	sportIds = sports.map(s => s.id),
					filterEvent = {
						filter: {
							limit: 1000,
							where: {
								status: {
									$in: ['FINISHED']
								},
								inviterSchoolId: activeSchoolId,
								$or: []
							}
						}
					};
				sportIds.forEach(sportId => filterEvent.filter.where.$or.push({sportId: sportId}));
				
				(window as any).Server.publicSchoolEvents.get(activeSchoolId, filterEvent)
					.then(events => {
						const sportIdsFromEvent = events.map(e => e.sportId);
						const resultSports = sports.filter(s => sportIdsFromEvent.indexOf(s.id) !== -1);
						
						binding.sub('schoolHomePage')
							.atomically()
							.set('leagueSports', Immutable.fromJS(resultSports))
							.set('currentLeagueSport', Immutable.fromJS(resultSports[0]))
							.set('leagueEvents', Immutable.fromJS(events))
							.set('isSyncLeagueSports', true)
							.set('leagueShow', resultSports.length > 0)
							.commit();
						
						this.getLeagueScores(binding.sub('schoolHomePage'), activeSchoolId, resultSports[0].id);
					});
			});
	}
	
	static getLeagueScores(binding, activeSchoolId, sportId) {
		if (sportId !== null) {
			const 	events = binding.toJS('leagueEvents'),
					eventFilteredBySport = events.filter(event => event.sportId === sportId);
			(window as any).Server.publicSchoolUnionSchools.get(activeSchoolId)
				.then(schools => {
					const schoolsId = schools.map(schools => schools.id);
					const scoresData = [];
					schoolsId.forEach(schoolId => {
						eventFilteredBySport.forEach((event, index) => {
							if (this._isSchoolConsistInEvent(schoolId, event)) {
								const 	schoolName 	= ScoreHelper.getSchoolNameFromEvent(schoolId, event),
									winGame 	= ScoreHelper.getWinGame(schoolId, event),
									drawGame 	= ScoreHelper.getDrawGame(schoolId, event),
									loseGame 	= ScoreHelper.getLoseGame(schoolId, event),
									points 		= ScoreHelper.getPoints(winGame, drawGame, loseGame),
									gf 			= ScoreHelper.getGF(schoolId, event),
									ga 			= ScoreHelper.getGA(schoolId, event),
									gd 			= ScoreHelper.getGD(gf, ga),
									playGame 	= ScoreHelper.getPlayGame(event);
								
								scoresData.push({
									schoolName: schoolName,
									'P': 		playGame,
									'W': 		winGame,
									'D': 		drawGame,
									'L': 		loseGame,
									'GF': 		gf,
									'GA': 		ga,
									'GD': 		gd,
									'Points': 	points
								});
							}
						});
					});
					const 	schoolsName 			= scoresData.map(scoreData => scoreData.schoolName),
							schoolsNameUniqArray 	= ScoreHelper.uniqueArray(schoolsName);
					
					//Transform array:
					//[schoolName] => [{schoolName: schoolName, P: 0}]
					let schoolsNameUniq = schoolsNameUniqArray.map(schoolName => {
						return {
							schoolName: schoolName,
							'P': 		0,
							'W': 		0,
							'D': 		0,
							'L': 		0,
							'GF': 		0,
							'GA': 		0,
							'GD': 		0,
							'Points': 	0
						}
					});
					
					schoolsNameUniq.forEach(schoolNameUniq => {
						scoresData.forEach(scoreData => {
							if (schoolNameUniq.schoolName === scoreData.schoolName) {
								schoolNameUniq.P 		= Number(schoolNameUniq.P) + Number(scoreData.P);
								schoolNameUniq.W 		= Number(schoolNameUniq.W) + Number(scoreData.W);
								schoolNameUniq.D 		= Number(schoolNameUniq.D) + Number(scoreData.D);
								schoolNameUniq.L 		= Number(schoolNameUniq.L) + Number(scoreData.L);
								schoolNameUniq.GF 		= Number(schoolNameUniq.GF) + Number(scoreData.GF);
								schoolNameUniq.GA 		= Number(schoolNameUniq.GA) + Number(scoreData.GA);
								schoolNameUniq.GD 		= Number(schoolNameUniq.GD) + Number(scoreData.GD);
								schoolNameUniq.Points 	= Number(schoolNameUniq.Points) + Number(scoreData.Points);
							}
						})
					});
					
					binding.set('leagueScores', Immutable.fromJS(schoolsNameUniq));
				});
		}
	}
	
	
	static _isSchoolConsistInEvent(schoolId, event){
		return event.invitedSchoolIds.some(invitedSchoolId => invitedSchoolId === schoolId)
	}
}