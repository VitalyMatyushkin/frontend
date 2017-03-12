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
 * @property {string} id - event id
 * @property {string} name - event name
 * @property {string} eventType - client event type ('inter-schools', 'houses' or 'internal')
 * @property {boolean} isFinished - event is finished
 * @property {boolean} isIndividualSport - event sport type is individual
 * @property {string} sport - sport name
 * @property {string} sportPointsType - type of points
 * @property {string} date - event start date
 * @property {string} time - event start time
 * @property {array} rivals - array of event rivals. rivals[0] - left, rivals[1] - right context
 * @property {string} rivals[i].name - name team or player
 * @property {string} rivals[i].from - from school or house name
 * @property {string} rivals[i].schoolPic - school emblem
 * @property {string} rivals[i].value - the combination of the 'name' and 'from'. Depending on the context(left, right),
 * 				the type of sport and the presence of an active school ID.
 * @property {string} score - event score string, for example: "3 : 1"
 * @property {array} scoreAr - array of event score strings. scoreAr[0] - left, scoreAr[1] - right context
 *
 * */
const ChallengeModel = function(event, activeSchoolId){
	this.id 		= event.id;
    this.name 		= this._getName(event, activeSchoolId);
	this.dateUTC	= event.startTime;
	this.date 		= DateHelper.getDate(event.startTime);
	this.time 		= DateHelper.getTime(event.startTime);
	this.eventType 	= EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType];
    this.isFinished = event.status === EventHelper.EVENT_STATUS.FINISHED;

	this.sport 				= event.sport ? event.sport.name : '';
	this.isIndividualSport 	= TeamHelper.isIndividualSport(event);
	this.isEventWithOneIndividualTeam	= EventHelper.isEventWithOneIndividualTeam(event);
	this.sportPointsType 	= event.sport && event.sport.points ? event.sport.points.display : '';

    this.rivals 	= this._getRivals(event, activeSchoolId);
	this.scoreAr 	= this._getScoreAr(event, activeSchoolId);
	this.score 		= this._getScore(event);
	this.textResult	= this._getTextResult(event);
};

ChallengeModel.prototype._getName = function(event, activeSchoolId){
	return typeof activeSchoolId !== 'undefined' && typeof event.generatedNames[activeSchoolId] !== 'undefined' ? event.generatedNames[activeSchoolId] : event.generatedNames.official;
};

ChallengeModel.prototype._getRivals = function(event, activeSchoolId){
    const rivals = [];

    rivals.push(TeamHelper.getRivalForLeftContext(event, activeSchoolId));
    rivals.push(TeamHelper.getRivalForRightContext(event, activeSchoolId));

    return rivals;
};

ChallengeModel.prototype._getScoreAr = function(event, activeSchoolId){
	if(this.isFinished) {
		const points1 = TeamHelper.callFunctionForLeftContext(activeSchoolId, event,
			TeamHelper.getCountPoints.bind(TeamHelper, event)),
			points2 = TeamHelper.callFunctionForRightContext(activeSchoolId, event,
				TeamHelper.getCountPoints.bind(TeamHelper, event)),
			result1 = TeamHelper.convertPoints(points1, this.sportPointsType).str,
			result2 = TeamHelper.convertPoints(points2, this.sportPointsType).str;

		return [result1, result2];
	} else {
		return ['-','-'];
	}
};

ChallengeModel.prototype._getScore = function(){
	switch (true) {
		case !this.isFinished:
			return '- : -';
		case this.isFinished && this.isIndividualSport:
			return '';
		case this.isFinished && !this.isIndividualSport:
			return this.scoreAr.join(' : ');
	}
};

ChallengeModel.prototype._getTextResult = function(event){
		if(this.isFinished && !this.isIndividualSport && event.eventType === "EXTERNAL_SCHOOLS") {
			const scoreArray = this.scoreAr;

			switch (event.sport.scoring) {
				case 'LESS_SCORES':
				case 'LESS_TIME':
				case 'LESS_RESULT':
					if(scoreArray[0] < scoreArray[1]) {
						return "Won";
					} else if(scoreArray[0] > scoreArray[1]) {
						return "Lost";
					} else {
						return "Draw";
					}
				case 'MORE_SCORES':
				case 'MORE_TIME':
				case 'MORE_RESULT':
				case 'FIRST_TO_N_POINTS':
					if(scoreArray[0] > scoreArray[1]) {
						return "Won";
					} else if(scoreArray[0] < scoreArray[1]) {
						return "Lost";
					} else {
						return "Draw";
					}
			}
		}
};

module.exports = ChallengeModel;