const Actions = {
	getEventById: function (schoolId, eventId) {
		return window.Server.schoolEvent.get({
			schoolId	: schoolId,
			eventId		: eventId
		});
	},
	submitEventDetailsChangesById: function(schoolId, eventId, changes) {
		return window.Server.schoolEvent.put(
			{
				schoolId	: schoolId,
				eventId		: eventId
			},
			{
				details	: changes
			}
		)
		.then(updEvent => updEvent.details);
	}
};

module.exports = Actions;
