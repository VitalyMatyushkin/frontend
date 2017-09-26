const ClubsActions = {
	removeParticipant: function(schoolId, clubId, participantId) {
		return window.Server.schoolClubParticipat.delete(
			{
				schoolId:		schoolId,
				clubId:			clubId,
				participantId:	participantId
			}
		);
	},
	addParticipant: function(schoolId, clubId, participant) {
		return window.Server.schoolClubParticipats.post(
			{
				schoolId:	schoolId,
				clubId:		clubId
			},
			participant
		);
	}
};

module.exports = ClubsActions;