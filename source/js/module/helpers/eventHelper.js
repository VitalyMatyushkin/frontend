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
	EVENT_STATUS: {
		FINISHED:		'FINISHED',
		NOT_FINISHED:	'NOT_FINISHED'
	},
	/**
	 * Create event summary object by event result object.
	 * Method calculate scores for each team in event and return hashMap [firstTeamId:score, secondTeamId]
	 */
	getTeamsSummaryByEventResult: function(eventResult) {
		const eventSummary = {};

		if(eventResult && eventResult.points) {
			for(let userId in eventResult.points) {
				if(eventSummary[eventResult.points[userId].teamId]) {
					eventSummary[eventResult.points[userId].teamId] += eventResult.points[userId].score;
				} else {
					eventSummary[eventResult.points[userId].teamId] = eventResult.points[userId].score;
				}
			}
		}

		return eventSummary;
	},
	/**
	 * Method return ID of winner team from eventResult
	 */
	getWinnerId: function(eventResult) {
		// Get event summary, it's hasMap teamId:score
		// Need convert it to array[{teamId,score}]
		const eventSummary = this.getTeamsSummaryByEventResult(eventResult);

		// Convert
		const arrayEventSummary = [];
		for(let teamId in eventSummary) {
			arrayEventSummary.push({
				teamId:	teamId,
				score:	eventSummary[teamId]
			});
		}

		// if teams haven't scores, it's - 0:0, or in the event of a dead heat.
		if(
			arrayEventSummary.length === 0 ||
			arrayEventSummary[0].score === (arrayEventSummary[1] && arrayEventSummary[1].score)
		) {
			return undefined;
		} else if(arrayEventSummary.length === 1) {// if only team has scores, it's - teamOneSc
			return arrayEventSummary[0].teamId;
		} else {
			return arrayEventSummary[0].score > arrayEventSummary[1].score ?
				arrayEventSummary[0].teamId :
				arrayEventSummary[1].teamId;
		}
	},
	isShowEventOnCalendar: function(event, activeSchoolId) {
		// don't show inter-schools events if invited school not yet accept invitation and
		// if invited school is an active school.
		return !(
			event.eventType === this.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			event.invitedSchoolId === activeSchoolId &&
			event.teams.length === 1 // if team count === 1 then opponent school not yet accept invitation
		);
	},
	isShowEventOnPublicSchoolCalendar: function(event) {
		// don't show inter-schools events if invited school not yet accept invitation and
		return !(
			event.eventType === this.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			event.teams.length === 1 // if team count === 1 then opponent school not yet accept invitation
		);
	}
};

module.exports = EventHelper;