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
	this.activeSchoolId = activeSchoolId;
    this.id = event.id;
    this.name = event.name;
	this.eventType = EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType];
    this.isFinished = event.status === EventHelper.EVENT_STATUS.FINISHED;
	this.isIndividualSport = TeamHelper.isIndividualSport(event);
    this.sport = event.sport ? event.sport.name : '';
    this.date = DateHelper.getDate(event.startTime);
    this.time = DateHelper.getTime(event.startTime);
    this.rivals = this._getRivals(event, activeSchoolId);
    this.score = this._getScore(event, activeSchoolId);
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