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

		//TODO Decorate this. Why? Look at getStudentDataForPersonalStudentPage function description.
		return this._getStudent(studentId, schoolId)
			.then(student => {
				studentData = student;
				studentData.student = {
					firstName:  student.firstName,
					lastName:   student.lastName
				};
				studentData.classData = student.form;
				if(!studentData.classData){
					window.Server.schoolForm.get({schoolId: student.schoolId, formId: student.formId})
						.then(classData => {
							studentData.classData = classData;
						});
				}
				studentData.houseData = student.house;
				if(!studentData.houseData){
					window.Server.schoolHouse.get({schoolId: student.schoolId, houseId: student.houseId})
						.then(houseData => {
							studentData.houseData = houseData;
						});
				}
				if(!schoolId){
					this._getChildEventsCount(studentId).then(data => {
						studentData.numberOfGamesPlayed = data.childEventCount[0];
						studentData.numOfGamesWon = data.childWinnerEventCount[0];
						studentData.numOfGamesScoredIn = data.childScoredEventCount[0];
					});
				}

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
				limit:1000
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