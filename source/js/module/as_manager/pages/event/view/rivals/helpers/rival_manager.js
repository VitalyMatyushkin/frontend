const	propz			= require('propz'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		ViewModeConsts	= require('module/ui/view_selector/consts/view_mode_consts'),
		RandomHelper	= require('module/helpers/random_helper');

const RivalManager = {
	getRivalsByEvent: function(activeSchoolId, event, viewMode) {
		const eventType = event.eventType;

		let rivals = [];
		if(TeamHelper.isTeamSport(event)) {
			if(EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] === eventType) {
				const	schoolsData	= event.schoolsData,
						teamsData	= event.teamsData;

				schoolsData.forEach(school => {

					const schoolTeams = teamsData.filter(teamData => teamData.schoolId === school.id);

					// school can have many teams
					if(schoolTeams.length > 0) {
						schoolTeams.forEach(schoolTeam => {
							const rival = {};

							rival.school	= school;
							rival.team		= schoolTeam;

							let schoolInvite = undefined;
							if (typeof event.invites !== 'undefined') {
								schoolInvite = event.invites.find(invite => invite.invitedSchoolId === school.id);
							}

							if(typeof schoolInvite !== 'undefined') {
								rival.invite = schoolInvite;
							}

							rivals.push(rival);
						});
					} else {
						const rival = {};

						rival.school = school;
						let schoolInvite = undefined;
						if (typeof event.invites !== 'undefined') {
							schoolInvite = event.invites.find(invite => invite.invitedSchoolId === school.id);
						}

						if(typeof schoolInvite !== 'undefined') {
							rival.invite = schoolInvite;
						}

						rivals.push(rival);
					}
				});

				rivals = rivals.sort((rival1, rival2) => {
					if(rival1.school.id === activeSchoolId && rival2.school.id !== activeSchoolId) {
						return -1;
					}
					if(rival1.school.id !== activeSchoolId && rival2.school.id === activeSchoolId) {
						return 1;
					}

					return 0;
				});
			} else if(EventHelper.clientEventTypeToServerClientTypeMapping['houses'] === eventType) {
				const	schoolsData	= event.schoolsData,
						housesData	= event.housesData,
						teamsData	= event.teamsData;

				// iterate all schools
				housesData.forEach(house => {
					const rival = {};

					rival.school = schoolsData[0];
					rival.house = house;
					// search all teams for current house
					teamsData.forEach(t => {
						if(t.houseId === house.id) {
							rival.team = t;
						}
					});

					rivals.push(rival);
				});

				rivals = rivals.sort((rival1, rival2) => {
					if(rival1.house.name < rival2.house.name) {
						return -1;
					}
					if(rival1.house.name > rival2.house.name) {
						return 1;
					}

					return 0;
				});
			} else if(EventHelper.clientEventTypeToServerClientTypeMapping['internal'] === eventType) {
				const	schoolsData	= event.schoolsData,
						teamsData	= event.teamsData;

				// iterate all schools
				teamsData.forEach(team => {
					const rival = {};

					rival.school = schoolsData[0];
					rival.team = team;

					rivals.push(rival);
				});

				rivals = rivals.sort((rival1, rival2) => {
					if(rival1.team.name < rival2.team.name) {
						return -1;
					}
					if(rival1.team.name > rival2.team.name) {
						return 1;
					}

					return 0;
				});
			}
		} else if(TeamHelper.isIndividualSport(event)) {
			if(
				EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] === eventType &&
				(
					viewMode === ViewModeConsts.VIEW_MODE.TABLE_VIEW ||
					viewMode === ViewModeConsts.VIEW_MODE.BLOCK_VIEW
				)
			) {
				const	schoolsData	= event.schoolsData,
						players		= event.individualsData,
						scores		= propz.get(event, ['results', 'individualScore']);
				// iterate all schools
				schoolsData.forEach(school => {
					const rival = {};

					rival.school = school;
					let schoolInvite = undefined;
					if (typeof event.invites !== 'undefined') {
						schoolInvite = event.invites.find(invite => invite.invitedSchoolId === school.id);
					}

					if(typeof schoolInvite !== 'undefined') {
						rival.invite = schoolInvite;
					}

					// search all players for current school
					rival.players = [];
					players.forEach( player => {
						const playerScoreObject = scores.find(score => score.userId === player.userId);

						if (typeof playerScoreObject !== 'undefined') {
							const	playerScore			= propz.get(playerScoreObject, ['score']),
									playerExtraScore	= propz.get(playerScoreObject, ['richScore', 'points']);

							player.score = playerScore;
							player.extraScore = playerExtraScore;
						} else {
							player.score = 0;
							player.extraScore = 0;
						}

						if(player.schoolId === school.id) {
							rival.players.push(player);
						}
					});

					rivals.push(rival);
				});
			} else if(
				EventHelper.clientEventTypeToServerClientTypeMapping['houses'] === eventType &&
				(
					viewMode === ViewModeConsts.VIEW_MODE.TABLE_VIEW ||
					viewMode === ViewModeConsts.VIEW_MODE.BLOCK_VIEW
				)
			) {
				const	schoolsData	= event.schoolsData,
						housesData	= event.housesData,
						players		= event.individualsData,
						scores		= propz.get(event, ['results', 'individualScore']);
				// iterate all schools
				housesData.forEach(house => {
					const rival = {};

					rival.school = schoolsData[0];
					rival.house = house;

					// search all players for current school
					rival.players = [];
					players.forEach( player => {
						const playerScoreObject = scores.find(score => score.userId === player.userId);

						if (typeof playerScoreObject !== 'undefined') {
							const	playerScore			= propz.get(playerScoreObject, ['score']),
									playerExtraScore	= propz.get(playerScoreObject, ['richScore', 'points']);

							player.score = playerScore;
							player.extraScore = playerExtraScore;
						} else {
							player.score = 0;
							player.extraScore = 0;
						}

						if(player.houseId === house.id) {
							rival.players.push(player);
						}
					});

					rivals.push(rival);
				});
			} else if(
				EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] === eventType &&
				viewMode === ViewModeConsts.VIEW_MODE.OVERALL_VIEW
			) {
				const	rival	= {},
						players	= event.individualsData,
						scores	= propz.get(event, ['results', 'individualScore']);

				rival.school = {};
				rival.players = [];
				players.forEach( player => {
					const playerScoreObject = scores.find(score => score.userId === player.userId);

					if (typeof playerScoreObject !== 'undefined') {
						const	playerScore			= propz.get(playerScoreObject, ['score']),
								playerExtraScore	= propz.get(playerScoreObject, ['richScore', 'points']);

						player.score = playerScore;
						player.extraScore = playerExtraScore;
					} else {
						player.score = 0;
						player.extraScore = 0;
					}

					player.school = event.schoolsData.find(school => school.id === player.schoolId);

					rival.players.push(player);

				});

				rivals.push(rival);
			} else if(
				EventHelper.clientEventTypeToServerClientTypeMapping['houses'] === eventType &&
				viewMode === ViewModeConsts.VIEW_MODE.OVERALL_VIEW
			) {
				const	rival		= {},
						schoolsData	= event.schoolsData,
						housesData	= event.housesData,
						players		= event.individualsData,
						scores		= propz.get(event, ['results', 'individualScore']);

				rival.school = schoolsData[0];
				rival.players = [];
				players.forEach(player => {
					const playerScoreObject = scores.find(score => score.userId === player.userId);

					if (typeof playerScoreObject !== 'undefined') {
						const	playerScore			= propz.get(playerScoreObject, ['score']),
							playerExtraScore	= propz.get(playerScoreObject, ['richScore', 'points']);

						player.score = playerScore;
						player.extraScore = playerExtraScore;
					} else {
						player.score = 0;
						player.extraScore = 0;
					}

					player.school = rival.school;
					player.house = housesData.find(house => house.id === player.houseId);

					rival.players.push(player);
				});

				rivals.push(rival);
			}
		}


		rivals.forEach(rival => {
			rival.id = RandomHelper.getRandomString();
		});

		return rivals;
	}
};

module.exports = RivalManager;