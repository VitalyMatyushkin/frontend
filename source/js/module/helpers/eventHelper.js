const EventHelper = {
	clientEventTypeToServerClientTypeMapping: {
		'inter-schools':	'EXTERNAL_SCHOOLS',
		'houses':			'INTERNAL_HOUSES',
		'internal':			'INTERNAL_TEAMS'
	},
	serverEventTypeToClientEventTypeMapping: {
		'EXTERNAL_SCHOOLS':	'inter-schools',
		'INTERNAL_HOUSES':	'houses',
		'INTERNAL_TEAMS':	'internal'
	},
	/**
	 * Create event summary object by event result object.
	 * Method calculate scores for each team in event and return hashMap [firstTeamId:score, secondTeamId]
	 */
	getTeamsSummaryByEventResult: function(eventResult) {
		const eventSummary = {};

		for(let userId in eventResult.points) {
			if(eventSummary[eventResult.points[userId].teamId]) {
				eventSummary[eventResult.points[userId].teamId] += eventResult.points[userId].score;
			} else {
				eventSummary[eventResult.points[userId].teamId] = eventResult.points[userId].score;
			}
		}

		return eventSummary;
	}
};

module.exports = EventHelper;