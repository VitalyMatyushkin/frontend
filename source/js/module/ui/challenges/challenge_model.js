/**
 * Created by Anatoly on 28.03.2016.
 */
const   DateHelper  = require('module/helpers/date_helper'),
        EventHelper = require('module/helpers/eventHelper'),
        TeamHelper  = require('module/ui/managers/helpers/team_helper');

/**
 * This component contains the necessary information to render header or the event list.
 * */
const ChallengeModel = function(event, activeSchoolId){
    const self = this;

    self.activeSchoolId 		= activeSchoolId;
    self.id 					= event.id;
    self.name 					= event.name;
	self.eventType 				= EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType];
    self.isFinished 			= event.status === EventHelper.EVENT_STATUS.FINISHED;
	self.isIndividualSport 		= TeamHelper.isIndividualSport(event);
    self.sport 					= event.sport ? event.sport.name : '';
    self.date 					= DateHelper.getDate(event.startTime);
    self.time 					= DateHelper.getTime(event.startTime);
    self.rivals 				= self._getRivals(event, activeSchoolId);
    self.score 					= self._getScore(event, activeSchoolId);
};

ChallengeModel.prototype._getRivals = function(event, activeSchoolId){
    const rivals = [];

    rivals.push(TeamHelper.getRivalForLeftContext(event, activeSchoolId));
    rivals.push(TeamHelper.getRivalForRightContext(event, activeSchoolId));

    return rivals;
};

ChallengeModel.prototype._getScore = function(event, activeSchoolId){
    const firstPoint = TeamHelper.callFunctionForLeftContext(activeSchoolId, event,
						TeamHelper.getCountPoints.bind(TeamHelper, event)),
		secondPoint = TeamHelper.callFunctionForRightContext(activeSchoolId, event,
						TeamHelper.getCountPoints.bind(TeamHelper, event));

    return this.isFinished ? [firstPoint, secondPoint].join(' : ') : '- : -';
};

module.exports = ChallengeModel;