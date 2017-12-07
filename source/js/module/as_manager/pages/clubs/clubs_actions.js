const ClubsActions = {
	getSportsService: function(schoolId) {
		return (sportName) => {
			const filter = {
				filter: {
					where: {
						name: {
							like: sportName,
							options: 'i'
						},
						players: 'INDIVIDUAL',
						'points.display': 'PRESENCE_ONLY'
					},
					limit: 50,
					order:'name ASC'
				}
			};

			return window.Server.schoolSports.get(schoolId, filter);
		};
	},
	getClub: function (schoolId, clubId) {
		return window.Server.schoolClub.get(
			{
				schoolId:	schoolId,
				clubId:		clubId
			}
		)
	},
	acvitateClub: function (schoolId, clubId) {
		return window.Server.schoolClubActivate.post(
			{
				schoolId:	schoolId,
				clubId:		clubId
			},
			{}
		);
	},
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
	},
	getVenueService: function(schoolId) {
		return (venue) => {
			const filter = {
				filter: {
					where: {
						text: {
							like: venue,
							options: 'i'
						}
					},
					limit: 50,
					order:'name ASC'
				}
			};
			return window.Server.schoolPlaces.get(schoolId, filter);
		};
	}
};

module.exports = ClubsActions;