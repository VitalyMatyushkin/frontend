const RoleHelper		= require('module/helpers/role_helper');

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
		return !(
			event.eventType === self.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			event.invitedSchoolId === activeSchoolId &&
			event.teams.length === 1 // if team count === 1 then opponent school not yet accept invitation
		);
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
		const	self	= this,
				binding	= thiz.getDefaultBinding();

		return	binding.get('model.status') === self.EVENT_STATUS.NOT_FINISHED &&
				RoleHelper.isUserSchoolWorker(thiz);
	},
	/**
	 * Return TRUE if participants count is two and event isn't close.
	 * Note: participants count can be equal one, if event is "inter-schools" and opponent school
	 * has not yet accepted invitation.
	 * @returns {boolean}
	 * @private
	 */
	_isShowCloseEventButton: function(thiz) {
		const	self	= this,
				binding	= thiz.getDefaultBinding();

		return	binding.get('participants').count() === 2 &&
				binding.get('model.status') === self.EVENT_STATUS.NOT_FINISHED &&
				binding.get('mode') === 'general' &&
				RoleHelper.isUserSchoolWorker(thiz);
	},
	/**
	 * Return TRUE if event edit mode is "closing".
	 * It's mean step before event will close.
	 * @returns {boolean}
	 * @private
	 */
	_isShowCancelEventEditButton: function(thiz) {
		const binding = thiz.getDefaultBinding();

		return binding.get('mode') === 'closing' && RoleHelper.isUserSchoolWorker(thiz);
	},
	/**
	 * Return TRUE if event edit mode is "general".
	 * @returns {boolean}
	 * @private
	 */
	_isShowEditEventButton: function(thiz) {
		const	self	= this,
				binding	= thiz.getDefaultBinding();

		return	binding.get('model.status') === self.EVENT_STATUS.NOT_FINISHED &&
				binding.get('mode') === 'general' &&
				binding.get('activeTab') === 'teams' &&
				RoleHelper.isUserSchoolWorker(thiz);
	},
	/**
	 * Return TRUE if event edit mode is "general".
	 * @returns {boolean}
	 * @private
	 */
	_isShowFinishEventEditingButton: function(thiz) {
		const binding = thiz.getDefaultBinding();

		return binding.get('mode') !== 'general' && binding.get('activeTab') === 'teams' && RoleHelper.isUserSchoolWorker(thiz);
	}
};

module.exports = EventHelper;