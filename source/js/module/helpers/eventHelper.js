const	RoleHelper		= require('module/helpers/role_helper'),
		EventsConst		= require('module/helpers/consts/events'),
		MoreartyHelper	= require('module/helpers/morearty_helper');

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
		COLLECTING_INVITE_RESPONSE:	'COLLECTING_INVITE_RESPONSE',
		INVITES_SENT:				'INVITES_SENT',
		SENDING_INVITES:			'SENDING_INVITES',
		FINISHED:					'FINISHED',
		NOT_FINISHED:				'NOT_FINISHED',
		DRAFT:						'DRAFT',
		ACCEPTED:					'ACCEPTED',
		REJECTED:					'REJECTED',
		CANCELED:					'CANCELED'
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
		const self = this;

		// Get event summary, it's hasMap teamId:score
		// Need convert it to array[{teamId,score}]
		const eventSummary = self.getTeamsSummaryByEventResult(eventResult);

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
		const self = this;

		// don't show inter-schools events if invited school not yet accept invitation and
		// if invited school is an active school.
		switch (event.eventType) {
			case self.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if(event.invitedSchoolIds[0] === activeSchoolId) {
					return event.status === "ACCEPTED" || event.status === "FINISHED";
				} else {
					return true;
				}
			default:
				return true;
		}
	},
	isShowEventOnPublicSchoolCalendar: function(event) {
		const self = this;

		// don't show inter-schools events if invited school not yet accept invitation and
		return !(
			event.eventType === self.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			event.teams.length === 1 // if team count === 1 then opponent school not yet accept invitation
		);
	},
	/**
	 * Return TRUE if event isn't finish and user is school worker
	 * @returns {boolean|*}
	 * @private
	 */
	_isShowEventButtons: function(thiz) {
		return RoleHelper.isUserSchoolWorker(thiz);
	},
	isNotFinishedEvent: function(binding) {
		const self = this;

		return (
			binding.get('model.status') === self.EVENT_STATUS.COLLECTING_INVITE_RESPONSE ||
			binding.get('model.status') === self.EVENT_STATUS.SENDING_INVITES ||
			binding.get('model.status') === self.EVENT_STATUS.NOT_FINISHED ||
			binding.get('model.status') === self.EVENT_STATUS.DRAFT ||
			binding.get('model.status') === self.EVENT_STATUS.ACCEPTED ||
			binding.get('model.status') === self.EVENT_STATUS.INVITES_SENT
		);
	},
	isGeneralMode: function(binding) {
		return binding.get('mode') === 'general';
	},
	isEventWithOneIndividualTeam: function(event) {
		const	eventType	= event.eventType ?  EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType] : event.type,
				sport		= event.sportModel ? event.sportModel : event.sport;

		return (eventType === 'internal') && (sport.players === 'INDIVIDUAL' || sport.players === '1X1');
	},
	isShowScoreButtons: function(event, mode, isOwner, individualScoreAvailable) {
		return (
					event.status === "NOT_FINISHED" ||
					event.status === "FINISHED" ||
					event.status === "DRAFT" ||
					event.status === "ACCEPTED" ||
					event.status === "INVITES_SENT"
			) &&
			mode === 'closing' &&
			isOwner && individualScoreAvailable;
	},
	isInterSchoolsEvent: function(event) {
		const self = this;

		return event.type ?
			event.type === "inter-schools" :
			self.serverEventTypeToClientEventTypeMapping[event.eventType] === "inter-schools";
	},
	isHousesEvent: function(event) {
		const self = this;

		return event.type ?
		event.type === "houses" :
		self.serverEventTypeToClientEventTypeMapping[event.eventType] === "houses";
	},
	isInternalEvent: function(event) {
		const self = this;

		return event.type ?
		event.type === "internal" :
		self.serverEventTypeToClientEventTypeMapping[event.eventType] === "internal";
	},
	getGenderListEvent: function() {
	  return [
	      {
	          key:EventsConst.EVENT_GENDERS_FILTER.MALE_ONLY,
	          value:'Boys only'
	      },
	      {
	          key:EventsConst.EVENT_GENDERS_FILTER.FEMALE_ONLY,
	          value:'Girls only'
	      },
	      {
	          key:EventsConst.EVENT_GENDERS_FILTER.MIXED,
	          value:'Mixed'
	      }
	  ];
	},
	getStatusListEvent: function() {
	  return [
	      {
	          key:EventsConst.EVENT_STATUS.DRAFT,
	          value:'Draft'
	      },
	      {
	          key:EventsConst.EVENT_STATUS.SENDING_INVITES,
	          value:'Sending invites'
	      },
	      {
	          key:EventsConst.EVENT_STATUS.INVITES_SENT,
	          value:'Invites sent'
	      },
	      {
	          key:EventsConst.EVENT_STATUS.COLLECTING_INVITE_RESPONSE,
	          value:'Collecting invite response'
	      },
	      {
	          key:EventsConst.EVENT_STATUS.ACCEPTED,
	          value:'Accepted'
	      },
	      {
	          key:EventsConst.EVENT_STATUS.REJECTED,
	          value:'Rejected'
	      },
	      {
	          key:EventsConst.EVENT_STATUS.FINISHED,
	          value:'Finished'
	      },
	      {
	          key:EventsConst.EVENT_STATUS.ON_HOLD,
	          value:'On hold'
	      },
	      {
	          key:EventsConst.EVENT_STATUS.CANCELED,
	          value:'Cancelled'
	      }
	  ];
	}
};

module.exports = EventHelper;