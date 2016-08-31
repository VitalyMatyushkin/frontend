const	Lazy			= require('lazy.js'),
		EventHelper		= require('module/helpers/eventHelper');

const StudentHelper = {
	/**
	 * Function return object which contain all required data for personal student page.
	 * NOTE: Student page exist for parent and for school workers roles, so @param schoolId is require ONLY for
	 * school workers role.
	 * @param studentId
	 * @param schoolId
	 * @returns {*}
	 */
	getStudentDataForPersonalStudentPage: function(studentId, schoolId) {
		let studentData;

		if(!schoolId){
			this._getChildEventsCount(studentId).then(data => {
				studentData.numberOfGamesPlayed = data.childEventCount[0];
				studentData.numOfGamesWon = data.childWinnerEventCount[0];
				studentData.numOfGamesScoredIn = data.childScoredEventCount[0];
			});
		}
		//TODO Decorate this. Why? Look at getStudentDataForPersonalStudentPage function description.
		return this._getStudent(studentId, schoolId)
			.then(student => {
				studentData = student;
				studentData.student = {
					firstName:  student.firstName,
					lastName:   student.lastName
				};
				studentData.classData = student.form;
				studentData.houseData = student.house;
				return window.Server.school.get({schoolId: studentData.schoolId});
			})
			.then(schoolData => {
				studentData.schoolData = schoolData;

				//TODO Decorate this. Why? Look at getStudentDataForPersonalStudentPage function description.
				return this._getParents(studentId, schoolId);
			})
			.then(parents => {
				studentData.parents = parents;
				return this._getWinStudentEvents(studentId, schoolId);
			})
			.then(events => {
				studentData.schoolEvent = this._getPlayedGames(events);
				studentData.gamesWon = this._getWinGames(studentId, events);
				studentData.gamesScoredIn = this._getScoredInEvents(studentId, events);

				if(schoolId){
					studentData.numberOfGamesPlayed = studentData.schoolEvent.length;
					studentData.numOfGamesWon = studentData.gamesWon.length;
					studentData.numOfGamesScoredIn = studentData.gamesScoredIn.length;
				}

				return studentData;
			});
	},
	_getPlayedGames: function(events) {
		return events.filter(event => event.status === EventHelper.EVENT_STATUS.FINISHED);
	},
	_getScoredInEvents: function(studentId, events) {
		const scoredInEvents = events.filter(event => { return event.ascription && event.ascription.childrenScored.length > 0;});

		//// Just inject student scores to events model
		//// Because on next steps of obtaining data(on user_achievements REACT component)
		//// We need studentId
		//scoredInEvents.forEach(scoredInEvent => {
		//	scoredInEvent.studentScore = scoredInEvent.result.points[studentId].score;
		//});

		return scoredInEvents;
	},
	_isStudentGetScores: function(studentId, event) {
		return event.result && event.result.points && event.result.points[studentId] ? true : false;
	},
	_isStudentFromCurrentTeam: function(studentId, team) {
		return Lazy(team.players).findWhere({userId:studentId}) ? true : false;
	},
	_isStudentTeamWin: function(studentId, event) {
		let isStudentTeamWin = false;

		if(event.status === EventHelper.EVENT_STATUS.FINISHED && event.result) {
			const winnerId = EventHelper.getWinnerId(event.result);
			winnerId && (isStudentTeamWin = this._isStudentFromCurrentTeam(
				studentId,
				Lazy(event.participants).findWhere({id: winnerId})
			));
		}

		return isStudentTeamWin;
	},
	_getWinGames: function(studentId, events) {
		return events.filter(event => {return event.ascription && event.ascription.childrenWin.length > 0;});
	},
	_getTeam: function(schoolId, eventId, teamId) {
		let team;

		return window.Server.publicSchoolEventTeam.get({schoolId: schoolId, eventId: eventId, teamId: teamId})
			.then(_team => {
				team = _team;

				return window.Server.publicSchool.get({schoolId: team.schoolId});
			})
			.then(school => {
				team.school = school;

				if(team.houseId) {
					return window.Server.publicSchoolHouse.get({schoolId: team.schoolId, houseId: team.houseId})
						.then(house => {
							team.house = house;

							return team;
						});
				} else {
					return team;
				}
			});
	},
	_getWinStudentEvents: function(studentId, schoolId) {
		if(schoolId){
			//TODO Decorate this. Why? Look at getStudentDataForPersonalStudentPage function description.
			return this._getStudentEvents(studentId, schoolId)
				.then(events => {
					return window.Server.sports.get({filter:{limit:100}})
						.then(sports => {
							return events.map(event => {
								event.sport = sports.find(sport => sport.id === event.sportId);
								return event;
							});
						});
				})
				.then(events => {
					return Promise.all(events.map(event => {
						return Promise.all(event.teams.map(teamId => {
								return this._getTeam(event.inviterSchoolId, event.id, teamId);
							}))
							.then(teams => {
								event.participants = teams;

								return event;
							});
					}))
				})
		} else {
			return this._getChildEvents(studentId)
		}
	},
	_getStudent: function(studentId, schoolId) {
		if(schoolId) {
			return window.Server.schoolStudent.get( {schoolId: schoolId, studentId: studentId} );
		} else {
			return window.Server.child.get( {childId: studentId} );
		}
	},
	_getStudentEvents: function(studentId, schoolId) {
		return window.Server.schoolStudentEvents.get( {schoolId: schoolId, studentId: studentId} );
	},
	_getChildEvents: function(studentId) {
		return window.Server.childrenEvents.get({filter:{
			where:{
				childIdList: [studentId],
				winnersChildIdList: [studentId],
				scoredChildIdList: [studentId],
				status: EventHelper.EVENT_STATUS.FINISHED
			},
			limit:1000
		}});
	},
	_getParents: function(studentId, schoolId) {
		if(schoolId) {
			return window.Server.schoolStudentParents.get( {schoolId: schoolId, studentId: studentId} );
		} else {
			return window.Server.childParents.get( {childId: studentId} );
		}
	},
	_getChildEventsCount: function (studentId){
		return window.Server.childrenEventsCount.get({filter:{
			where:{
				childIdList: [studentId],
				winnersChildIdList: [studentId],
				scoredChildIdList: [studentId],
				status: EventHelper.EVENT_STATUS.FINISHED
			}
		}});
	}
};

module.exports = StudentHelper;