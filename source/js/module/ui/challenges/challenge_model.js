/**
 * Created by Anatoly on 28.03.2016.
 */
const   DateHelper  = require('module/helpers/date_helper'),
        EventHelper = require('module/helpers/eventHelper'),
        TeamHelper  = require('module/ui/managers/helpers/team_helper');

/**
 * This component contains the necessary information to render header or the event list.
 * @class
 * @param {object} event - event object
 * @param {string} activeSchoolId - activeSchoolId
 *
 * @property {string} activeSchoolId - activeSchoolId
 * @property {string} id - event id
 * @property {string} name - event name
 * @property {string} eventType - client event type ('inter-schools', 'houses' or 'internal')
 * @property {boolean} isFinished - event is finished
 * @property {boolean} isIndividualSport - event sport type is individual
 * @property {string} sport - sport name
 * @property {string} date - event start date
 * @property {string} time - event start time
 * @property {array} rivals - array of event rivals. rivals[0] - left, rivals[1] - right context
 * @property {string} rivals[i].name - name team or player
 * @property {string} rivals[i].from - from school or house name
 * @property {string} rivals[i].schoolPic - school emblem
 * @property {string} rivals[i].value - the combination of the 'name' and 'from'. Depending on the context(left, right),
 * 				the type of спорт and the presence of an active school ID.
 * @property {string} score - event score string, for example: "3 : 1"
 *
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