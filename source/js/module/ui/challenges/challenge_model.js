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

const CRICKET_WICKETS = 10;

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
	this.textResult	= this._getTextResult(event, activeSchoolId);
};

ChallengeModel.prototype._getName = function(event, activeSchoolId){
	return typeof activeSchoolId !== 'undefined' && typeof event.generatedNames[activeSchoolId] !== 'undefined' ?
		event.generatedNames[activeSchoolId] :
		event.generatedNames.official;
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
				TeamHelper.getCountPoints.bind(TeamHelper, event));
		let result1, result2;
		if (event.sport.name.toLowerCase() === 'cricket') {
			result1 = TeamHelper.convertPointsCricket(points1).runs + '/' + TeamHelper.convertPointsCricket(points1).wickets;
			result2 = TeamHelper.convertPointsCricket(points2).runs + '/' + TeamHelper.convertPointsCricket(points1).wickets;
		} else {
			result1 = TeamHelper.convertPoints(points1, this.sportPointsType).str;
			result2 = TeamHelper.convertPoints(points2, this.sportPointsType).str;
		}

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

ChallengeModel.prototype.isTeamFromActiveSchoolCricket = function(teamId, activeSchoolId, teamsData){
	teamsData = teamsData.filter(team => team.schoolId === activeSchoolId);
	return teamId === teamsData[0].id;
};

ChallengeModel.prototype.getTeamNameCricket = function(teamId, teamsData, eventType, schoolsData, housesData){
	switch(true){
		case eventType === 'EXTERNAL_SCHOOLS':
			teamsData = teamsData.filter(team => {return team.id === teamId});
			schoolsData = schoolsData.filter(school => school.id === teamsData[0].schoolId);
			return schoolsData[0].name;
		case eventType === 'INTERNAL_TEAMS':
			teamsData = teamsData.filter(team => {return team.id === teamId});
			return teamsData[0].name;
		case eventType === 'INTERNAL_HOUSES':
			teamsData = teamsData.filter(team => {return team.id === teamId});
			return teamsData[0].name;
		default:
			return 'undefined'
	}
};

ChallengeModel.prototype.getRunsForLeftSide = function(event, activeSchoolId){
	const scoreArray = this.scoreAr;
	return scoreArray[0].split('/')[0];
};

ChallengeModel.prototype.getRunsForRightSide = function(event, activeSchoolId){
	const scoreArray = this.scoreAr;
	return scoreArray[1].split('/')[0];
};

ChallengeModel.prototype.getWicketsForLeftSide = function(event, activeSchoolId){
	const scoreArray = this.scoreAr;
	return scoreArray[0].split('/')[1];
};

ChallengeModel.prototype.getWicketsForRightSide = function(event, activeSchoolId){
	const scoreArray = this.scoreAr;
	return scoreArray[1].split('/')[1];
};

ChallengeModel.prototype._getTextResult = function(event, activeSchoolId){
		if (this.isFinished && event.sport.name.toLowerCase() === 'cricket') { //то это полная жопа
			const 	teamId 			= typeof event.results.cricketResult !== 'undefined' ? event.results.cricketResult.who : undefined,
					result 			= typeof event.results.cricketResult !== 'undefined' ? event.results.cricketResult.result.toLowerCase() : undefined,
					teamsData 		= event.teamsData,
					schoolsData		= TeamHelper.getSchoolsData(event),
					eventType 		= event.eventType,
					lostInResults 	= event.eventType === 'EXTERNAL_SCHOOLS' ? 'Lost, ' : '',
					runsAbs 		= Math.abs(Number(this.getRunsForLeftSide(event, activeSchoolId) - Number(this.getRunsForRightSide(event, activeSchoolId)))),
					wicketsLeft 	= Math.abs(CRICKET_WICKETS - Number(this.getWicketsForLeftSide(event, activeSchoolId))),
					wicketsRight 	= Math.abs(CRICKET_WICKETS - Number(this.getWicketsForRightSide(event, activeSchoolId)));

			switch (true) {
				case result === 'tie' || result === 'draw' || result === 'tbd':
					return result.toUpperCase();
				case result === 'no_result':
					return `No result`;
				case result === 'won_by_runs' && this.isTeamFromActiveSchoolCricket(teamId, activeSchoolId, teamsData):
					return `${this.getTeamNameCricket(teamId, teamsData, eventType, schoolsData)} won by ${runsAbs} runs`;
				case result === 'won_by_wickets' && this.isTeamFromActiveSchoolCricket(teamId, activeSchoolId, teamsData):
					return `${this.getTeamNameCricket(teamId, teamsData, eventType, schoolsData)} won by ${wicketsLeft} wickets`;
				case result === 'won_by_innings_and_runs' && this.isTeamFromActiveSchoolCricket(teamId, activeSchoolId, teamsData):
					return `${this.getTeamNameCricket(teamId, teamsData, eventType, schoolsData)} won by innings and ${runsAbs} runs`;
				case result === 'won_by_runs' && !this.isTeamFromActiveSchoolCricket(teamId, activeSchoolId, teamsData):
					return `${lostInResults}${this.getTeamNameCricket(teamId, teamsData, eventType, schoolsData)} won by ${runsAbs} runs`;
				case result === 'won_by_wickets' && !this.isTeamFromActiveSchoolCricket(teamId, activeSchoolId, teamsData):
					return `${lostInResults} ${this.getTeamNameCricket(teamId, teamsData, eventType, schoolsData)} won by ${wicketsRight} wickets`;
				case result === 'won_by_innings_and_runs' && !this.isTeamFromActiveSchoolCricket(teamId, activeSchoolId, teamsData):
					return `${lostInResults}${this.getTeamNameCricket(teamId, teamsData, eventType, schoolsData)} won by innings and ${runsAbs} runs`;
				case result === 'match_awarded' && this.isTeamFromActiveSchoolCricket(teamId, activeSchoolId, teamsData):
					return `Match awarded to ${this.getTeamNameCricket(teamId, teamsData, eventType, schoolsData)}`;
				case result === 'match_awarded' && !this.isTeamFromActiveSchoolCricket(teamId, activeSchoolId, teamsData):
					return `Match conceded to ${this.getTeamNameCricket(teamId, teamsData, eventType, schoolsData)}`;
				default:
					return `No result yet`;
			}
		}
	
		if(this.isFinished && !this.isIndividualSport && event.eventType === "EXTERNAL_SCHOOLS" && event.sport.name.toLowerCase() !== 'cricket') {
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