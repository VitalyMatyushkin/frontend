const	Lazy			= require('lazyjs'),
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

		//TODO Decorate this. Why? Look at getStudentDataForPersonalStudentPage function description.
		return this._getStudent(studentId, schoolId)
			.then(student => {
				studentData = student;
				studentData.student = {
					firstName:  student.firstName,
					lastName:   student.lastName
				};
				return window.Server.schoolForm.get({schoolId: student.schoolId, formId: student.formId});
			})
			.then(classData => {
				studentData.classData = classData;
				return window.Server.schoolHouse.get({schoolId: studentData.schoolId, houseId: studentData.houseId});
			})
			.then(houseData => {
				studentData.houseData = houseData;
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
				studentData.numberOfGamesPlayed = studentData.schoolEvent.length;

				studentData.gamesWon = this._getWinGames(studentId, events);
				studentData.numOfGamesWon = studentData.gamesWon.length;

				studentData.gamesScoredIn = this._getScoredInEvents(studentId, events);
				studentData.numOfGamesScoredIn = studentData.gamesScoredIn.length;

				return studentData;
			});
	},
	_getPlayedGames: function(events) {
		return events.filter(event => event.status === EventHelper.EVENT_STATUS.FINISHED);
	},
	_getScoredInEvents: function(studentId, events) {
		const scoredInEvents = events.filter(event => {
			return this._isStudentGetScores(studentId, event);
		});

		// Just inject student scores to events model
		// Because on next steps of obtaining data(on user_achievements REACT component)
		// We need studentId
		scoredInEvents.forEach(scoredInEvent => {
			scoredInEvent.studentScore = scoredInEvent.result.points[studentId].score;
		});

		return scoredInEvents;
	},
	_isStudentGetScores: function(studentId, event) {
		return event.result && event.result.points[studentId] ? true : false;
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
		return events.filter(event => {
			return this._isStudentTeamWin(studentId, event);
		});
	},
	_getTeam: function(schoolId, teamId) {
		let team;

		return window.Server.team.get({schoolId: schoolId, teamId: teamId})
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

		//TODO Decorate this. Why? Look at getStudentDataForPersonalStudentPage function description.
		return this._getStudentEvents(studentId, schoolId)
			.then(events => Promise.all(events.map(event =>
				window.Server.sport.get({sportId:event.sportId}).then(sport => {
					event.sport = sport;

					return event;
				})
			)))
			.then(events => {
				return Promise.all(events.map(event => {
					return Promise.all(event.teams.map(teamId => {
							return this._getTeam(event.inviterSchoolId, teamId);
						}))
						.then(teams => {
							event.participants = teams;

							return event;
						});
				}))
			})
	},
	_getStudent: function(studentId, schoolId) {
		if(schoolId) {
			return window.Server.schoolStudent.get( {schoolId: schoolId, studentId: studentId} );
		} else {
			return window.Server.userChild.get( {childId: studentId} );
		}
	},
	_getStudentEvents: function(studentId, schoolId) {
		if(schoolId) {
			return window.Server.schoolStudentEvents.get( {schoolId: schoolId, studentId: studentId} );
		} else {
			return window.Server.userChildEvents.get( {childId: studentId} );
		}
	},
	_getParents: function(studentId, schoolId) {
		if(schoolId) {
			return window.Server.schoolStudentParents.get( {schoolId: schoolId, studentId: studentId} );
		} else {
			return window.Server.parentsChild.get( {childId: studentId} );
		}
	}
};

module.exports = StudentHelper;