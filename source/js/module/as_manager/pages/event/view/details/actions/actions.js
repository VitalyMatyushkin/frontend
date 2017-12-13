const Actions = {
	getEventById: function (schoolId, eventId) {
		return window.Server.schoolEvent.get({
			schoolId	: schoolId,
			eventId		: eventId
		});
	},
	getDetailsByEventId: function (schoolId, eventId) {
		return window.Server.schoolEventDetails.get({
			schoolId	: schoolId,
			eventId		: eventId
		});
	},
	submitEventDetailsChangesById: function(schoolId, eventId, changes) {
		return window.Server.schoolEventDetails.put(
			{
				schoolId	: schoolId,
				eventId		: eventId
			},
			changes
		)
	},
	submitEventGroupDetailsChangesById: function(schoolId, eventId, changes) {
		return window.Server.schoolEventGroupDetails.put(
			{
				schoolId	: schoolId,
				eventId		: eventId
			},
			changes
		)
	}
};

module.exports = Actions;
