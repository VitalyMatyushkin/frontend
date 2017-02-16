const	Lazy			= require('lazy.js'),
		Promise 		= require('bluebird'),
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
					firstName: student.firstName,
					lastName: student.lastName,
					medicalInfo: student.medicalInfo,
					birthday: student.birthday,
					age: this._calculateAge(student.birthday)
				};
				studentData.classData = student.form;
				let formPromise;
				if (!studentData.classData) {
					formPromise = window.Server.schoolForm.get({schoolId: student.schoolId, formId: student.formId})
						.then(classData => {
							studentData.classData = classData;
						});
				}
				else
					formPromise = Promise.resolve();

				studentData.houseData = student.house;
				let housePromise;
				if (!studentData.houseData) {
					housePromise = window.Server.schoolHouse.get({schoolId: student.schoolId, houseId: student.houseId})
						.then(houseData => {
							studentData.houseData = houseData;
						});
				}
				else
					housePromise = Promise.resolve();

				let countsPromise;
				if (!schoolId) {
					countsPromise = this._getChildEventsCount(studentId).then(data => {
						studentData.numberOfGamesPlayed = data.childEventCount[0];
						studentData.numOfGamesWon = data.childWinnerEventCount[0];
						studentData.numOfGamesScoredIn = data.childScoredEventCount[0];
					});
				}
				else
					countsPromise = Promise.resolve();

				return Promise.all([formPromise, housePromise, countsPromise]);
			}).then(() => {
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

	/**
	 * Calculate age
	 * @param {string} birthday - string of date
	 * @returns {number} - count of full years.
	 * */
	_calculateAge: function (birthday) {
		const  ageDifMs = Date.now() - new Date(birthday).getTime();
		var ageDate = new Date(ageDifMs); // miliseconds from epoch

		return Math.abs(ageDate.getUTCFullYear() - 1970);
	},
	_getPlayedGames: function(events) {
		return events.filter(event => event.status === EventHelper.EVENT_STATUS.FINISHED);
	},
	_getScoredInEvents: function(studentId, events) {
		const scoredInEvents = events.filter(event => {
			return event.ascription && (event.ascription.childrenScored && event.ascription.childrenScored.length ||
				event.ascription.isScored);
		});

		// Just inject student scores to events model
		// Because on next steps of obtaining data(on user_achievements REACT component)
		// We need studentId
		scoredInEvents.forEach(scoredInEvent => {
			const result = scoredInEvent.results.individualScore.find(r => r.userId === studentId);
			scoredInEvent.studentScore = result ? result.score : "student's team got some scores";
		});

		return scoredInEvents;
	},
	_getWinGames: function(studentId, events) {
		return events.filter(event => {
			return event.ascription && (event.ascription.childrenWin && event.ascription.childrenWin.length ||
			event.ascription.isWin);
		});
	},
	_getWinStudentEvents: function(studentId, schoolId) {
		if(schoolId){
			//TODO Decorate this. Why? Look at getStudentDataForPersonalStudentPage function description.
			return this._getStudentEvents(studentId, schoolId);
		} else {
			return this._getChildEvents(studentId);
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
		return window.Server.schoolStudentEvents.get(
			{schoolId: schoolId, studentId: studentId},
			{filter:{
				where:{
					status: EventHelper.EVENT_STATUS.FINISHED
				},
				limit:10
			}}
		);
	},
	_getChildEvents: function(studentId) {
		return window.Server.childrenEvents.get({filter:{
			where:{
				childIdList: [studentId],
				winnersChildIdList: [studentId],
				scoredChildIdList: [studentId],
				status: EventHelper.EVENT_STATUS.FINISHED
			},
			limit:10
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
	},
	/**
	 * Functions for student role
	 */
	getStudentWinGames: function(studentId, events) {

		const winEvents = events.filter(event => {
			let teamIdFromEvent 	= '',
				isWinner 			= false;

			if (event.results['teamScore'].length !== 0) {
				//Returns teamId student
				event.teamsData.forEach(teamData => {
					teamData.players.forEach(player => {
						if (player.userId === studentId) {
							teamIdFromEvent = teamData.id;
						}
					});
				});
				//Returns result isWinner (true/false) for team student
				event.results.teamScore.forEach(team => {
					if (team.teamId === teamIdFromEvent) {
						isWinner = team.isWinner;
					}
				});
			}

			//only events with teamScore and win we add in winEvents
			return 	event.results['teamScore'].length !== 0 && isWinner;
		});
		return winEvents;
	},
	getStudentScoredInEvents: function(studentId, events) {
		const scoredInEvents = events.filter(event => {
			//only events with score we add in scoredInEvents
			return 	event.results['houseScore'].length !== 0 ||
					event.results['individualScore'].length !== 0 ||
					event.results['schoolScore'].length !== 0 ||
					event.results['teamScore'].length !== 0;
		});

		// Just inject student scores to events model
		// Because on next steps of obtaining data(on user_achievements REACT component)
		// We need studentId
		scoredInEvents.forEach(scoredInEvent => {
			const result = scoredInEvent.results.individualScore.find(r => r.userId === studentId);
			scoredInEvent.studentScore = result ? result.score : "student's team got some scores";
		});
		return scoredInEvents;
	},
	getStudentProfile: function(schoolId){
		let studentData;
		const schoolIdAsArray = [schoolId];

		return window.Server.profile.get().then(student => {
			studentData = student;
			studentData.student = {
				firstName: student.firstName,
				lastName: student.lastName,
				medicalInfo: 'No information', // doesn't exist in server request
				birthday: student.birthday,
				age: this._calculateAge(student.birthday)
			};

			return window.Server.profilePermissions.get();
		}).then(permisions => {
			permisions.forEach(permision => {
				if (permision.schoolId === schoolId) {
					if (typeof permision.details !== 'undefined') {
						studentData.classData = typeof permision.details.formId !== 'undefined' ? permision.details.formId : null;
						studentData.houseData = typeof permision.details.houseId !== 'undefined' ? permision.details.houseId : null;
					} else {
						studentData.classData = null;
						studentData.houseData = null;
					}
				}
			});

			if (studentData.classData !== null) {
				window.Server.publicSchoolForm.get({schoolId: schoolId, formId: studentData.classData}).then(classData => {
					studentData.formName = classData.name;
				})
			}
			if (studentData.houseData !== null) {
				window.Server.publicSchoolHouse.get({schoolId: schoolId, houseId: studentData.houseData}).then(houseData => {
					studentData.houseName = houseData.name;
				})
			}

			return window.Server.publicSchools.get({
				filter: {
					where: {
						id: {$in: schoolIdAsArray}
					}
				}
			});
			}
		).then(schoolData => {
			studentData.schoolData = schoolData;


			return window.Server.studentSchoolEvents.get({
				filter: {
					where:{
						status: {
							$in: ['FINISHED']
						},
						schoolId: {
							$in: schoolIdAsArray
						}
					}
				}
			})
		}).then( eventsData => {
			studentData.gamesScoredIn 			= this.getStudentScoredInEvents(studentData.id, eventsData);
			studentData.numOfGamesScoredIn 		= studentData.gamesScoredIn.length;
			studentData.schoolEvent 			= this._getPlayedGames(eventsData);
			studentData.numberOfGamesPlayed 	= studentData.schoolEvent.length;
			studentData.gamesWon 				= this.getStudentWinGames(studentData.id, eventsData);
			studentData.numOfGamesWon 			= studentData.gamesWon.length;
			return studentData;
		});
	}
};

module.exports = StudentHelper;