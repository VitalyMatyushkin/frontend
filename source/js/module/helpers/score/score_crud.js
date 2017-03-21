const ScoreCRUD = {
	addSchoolScore: function(schoolId, eventId, data) {
		return window.Server.schoolEventResultSchoolScores.post({
				schoolId:	schoolId,
				eventId:	eventId
			},
			data
		);
	},
	addHouseScore: function(schoolId, eventId, data) {
		return window.Server.schoolEventResultHousesScores.post({
				schoolId:	schoolId,
				eventId:	eventId
			},
			data
		);
	},
	addTeamScore: function(schoolId, eventId, data) {
		return window.Server.schoolEventResultTeamScores.post({
				schoolId:	schoolId,
				eventId:	eventId
			},
			data
		);
	},
	updateTeamScore: function(schoolId, eventId, scoreId, data) {
		return window.Server.schoolEventResultTeamScore.put({
				schoolId:	schoolId,
				eventId:	eventId,
				scoreId:	scoreId
			},
			data
		);
	},
	deleteSchoolScore: function(schoolId, eventId, scoreId) {
		return window.Server.schoolEventResultSchoolScore.delete({
				schoolId:	schoolId,
				eventId:	eventId,
				scoreId:	scoreId
			});
	},
	deleteHouseScore: function(schoolId, eventId, scoreId) {
		return window.Server.schoolEventResultHousesScore.delete({
				schoolId:	schoolId,
				eventId:	eventId,
				scoreId:	scoreId
			});
	},
	deleteTeamScore: function(schoolId, eventId, scoreId) {
		return window.Server.schoolEventResultTeamScore.delete({
				schoolId:	schoolId,
				eventId:	eventId,
				scoreId:	scoreId
			});
	},
	deleteIndividualScorePoint: function(schoolId, eventId, scoreId) {
		return window.Server.schoolEventResultIndividualsScore.delete({
				schoolId:	schoolId,
				eventId:	eventId,
				scoreId:	scoreId
			});
	}
};

module.exports = ScoreCRUD;