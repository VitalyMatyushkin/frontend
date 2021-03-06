/**
 * Created by Anatoly on 28.03.2016.
 */
import {DateHelper} from 'module/helpers/date_helper';
import * as EventHelper from 'module/helpers/eventHelper';
import * as SportHelper from 'module/helpers/sport_helper';
import {ChallengeModelHelper} from 'module/ui/challenges/challenge_model_helper';
import * as TeamHelper from 'module/ui/managers/helpers/team_helper';
import * as ViewModeConsts from 'module/ui/view_selector/consts/view_mode_consts';
import * as RivalManager from 'module/as_manager/pages/event/view/rivals/helpers/rival_manager';
import {Event} from 'module/as_manager/pages/events/events';

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

interface Score {
	isWinner: boolean
	richScore: {}
	score: number
	teamId?: string
	houseId?: string
	schoolId?: string
	_id: string
}

export class ChallengeModel {
	id: string;
	name: string;
	dateUTC: string;
	date: string;
	time: string;
	endTime: string;
	eventType: string;
	isFinished: boolean;

	sport: string;
	isIndividualSport: boolean;
	isEventWithOneIndividualTeam: boolean;
	sportPointsType: string;

	rivals: any;

	scoreAr: string[];
	score: string;
	textResult: string;


	constructor(event: Event, activeSchoolId: string, activeSchoolKind: string, isPublicSite: boolean){
		this.id 		= event.id;
		this.name 		= this._getName(event, activeSchoolId);
		this.dateUTC	= event.startTime;
		this.date 		= DateHelper.getDate(event.startTime);
		this.time 		= DateHelper.getTime(event.startTime);
		if(typeof event.endTime !== 'undefined') {
			this.endTime 	= DateHelper.getTime(event.endTime);
		}
		this.eventType 	= EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType];
		this.isFinished = event.status === EventHelper.EVENT_STATUS.FINISHED;

		this.sport 				= event.sport ? event.sport.name : '';
		this.isIndividualSport 	= TeamHelper.isIndividualSport(event);
		this.isEventWithOneIndividualTeam	= EventHelper.isEventWithOneIndividualTeam(event);
		this.sportPointsType 	= event.sport && event.sport.points ? event.sport.points.display : '';

		this.rivals 	= this._getRivals(event, activeSchoolId, activeSchoolKind);
		if (this.sportPointsType !== 'PRESENCE_ONLY') {
			this.scoreAr = this._getScoreAr(event, activeSchoolId, activeSchoolKind, isPublicSite);
			this.score = this._getScore(event, activeSchoolId, activeSchoolKind, isPublicSite);
			this.textResult = this._getTextResult(event, activeSchoolId, activeSchoolKind);
		}
	}

	_getName (event: Event, activeSchoolId: string) {
		return typeof activeSchoolId !== 'undefined' && typeof event.generatedNames[activeSchoolId] !== 'undefined' ?
			event.generatedNames[activeSchoolId] :
			event.generatedNames.official;
	}

	_getRivals (event: Event, activeSchoolId: string, activeSchoolKind: string) {
		let rivals = [];

		// TODO it's temporary plug.
		// Problem: for fixtures list on public school union page we need different rivals data then by default
		// RivalManager can provide data that similar to data we need but strictly speaking rival manager
		// is not intended for this purpose
		// Also SU fixture list view support this data type
		// But in global perspective we need refactoring for rivals data
		// Because rivals data doesn't support multiparty events
		if( TeamHelper.isNewEvent(event) && activeSchoolKind === 'SchoolUnion') {
			event.schoolsData = event.invitedSchools;
			rivals = rivals.concat(RivalManager.getRivalsByEvent(activeSchoolId, event, ViewModeConsts.VIEW_MODE.BLOCK_VIEW));
		} else {
			rivals.push(TeamHelper.getRivalForLeftContext(event, activeSchoolId));
			rivals.push(TeamHelper.getRivalForRightContext(event, activeSchoolId));
		}

		return rivals;
	}

	_getSettings (event: Event, activeSchoolId: string) {
		return event.settings.find(s => s.schoolId === activeSchoolId);
	}

	_getScoreAr (_event: Event, activeSchoolId: string, activeSchoolKind: string, isPublicSite: boolean) {
		if(this.isFinished) {
			const event = Object.assign({}, _event);

			// hack for school union
			if(activeSchoolKind === 'SchoolUnion') {
				event.inviterSchoolId = undefined;
				event.inviterSchool = undefined;
			}
			const points1 = TeamHelper.callFunctionForLeftContext(
				activeSchoolId,
				event,
				TeamHelper.getCountPoints.bind(TeamHelper, event)
				),
				points2 = TeamHelper.callFunctionForRightContext(
					activeSchoolId,
					event,
					TeamHelper.getCountPoints.bind(TeamHelper, event)
				);

			let result1, result2;
			if (SportHelper.isCricket(event.sport.name)) {
				result1 = TeamHelper.convertPointsCricket(points1).runs + '/' + TeamHelper.convertPointsCricket(points1).wickets;
				result2 = TeamHelper.convertPointsCricket(points2).runs + '/' + TeamHelper.convertPointsCricket(points2).wickets;
			} else {
				result1 = TeamHelper.convertPoints(points1, this.sportPointsType).str;
				result2 = TeamHelper.convertPoints(points2, this.sportPointsType).str;
			}

			// check settings
			const settings = this._getSettings(event, activeSchoolId);
			if(typeof settings !== 'undefined' && !settings.isDisplayResultsOnPublic && typeof isPublicSite === 'boolean' && isPublicSite) {
				if(result1 === result2) {
					result1 = "Draw";
					result2 = "Draw";
				} else {
					result1 = result1 > result2 ? 'Win': 'Lost';
					result2 = result2 > result1 ? 'Win': 'Lost';
				}
			}

			return [result1, result2];
		} else {
			return ['-','-'];
		}
	}

	_getScore (event: Event, activeSchoolId: string, activeSchoolKind: string, isPublicSite: boolean) {
		const settings = this._getSettings(event, activeSchoolId);
		let isDisplayResultsOnPublic = typeof settings !== 'undefined' ? settings.isDisplayResultsOnPublic : true;

		switch (true) {
			// Always empty for SchoolUnion and multiparty
			case (
				event.inviterSchool.id === activeSchoolId &&
				event.inviterSchool.kind === 'SchoolUnion' &&
				event.sport.multiparty
			): {
				return '';
			}
			// For not finished and NOT multiparty
			case (
				!this.isFinished &&
				!event.sport.multiparty
			): {
				return '- : -';
			}
			case (
				this.isFinished &&
				TeamHelper.isTeamSport(event) &&
				event.sport.multiparty &&
				event.teamsData.length !== 2
			): {
				return '';
			}
			case (
				this.isFinished &&
				this.isIndividualSport
			): {
				return '';
			}
			case (
				this.isFinished &&
				!this.isIndividualSport &&
				typeof isPublicSite === 'boolean' && isPublicSite &&
				!isDisplayResultsOnPublic
			): {
				return this.scoreAr[0];
			}
			case (
				this.isFinished &&
				!this.isIndividualSport
			): {
				return this.scoreAr.join(' : ');
			}
		}
	}

	isTeamFromActiveSchoolCricket (teamId: string, activeSchoolId: string, teamsData, schoolsData) {
		const teamsDataFiltered = teamsData.filter(team => team.schoolId === activeSchoolId);
		if (teamsDataFiltered.length === 0) {
			const schoolsDataFiltered = schoolsData.filter(school => school.id === activeSchoolId);
			if (schoolsDataFiltered.length === 0) {			// if teamsData.length === 0 && schoolsDataFiltered.length === 0, we are on the public school union site
				return true; 								// for public school union site we set flag isTeamFromActiveSchoolCricket in true
			} else {
				return teamId === schoolsDataFiltered[0].id;
			}
		} else if (teamsDataFiltered.length === 1) { 	//for EXTERNAL_SCHOOLS matches only 1 team may be from active school
			return teamId === teamsDataFiltered[0].schoolId || teamId === teamsDataFiltered[0].id; //teamId maybe schoolId or just id
		} else { 										//for INTERNAL_TEAMS and INTERNAL_HOUSES matches 2 teams may be from active school
			return true; 								//for INTERNAL_TEAMS and INTERNAL_HOUSES we set flag isTeamFromActiveSchoolCricket in true
		}
	}

	getTeamNameCricket (teamId: string, teamsData: {name: string, schoolId: string, id: string}[], housesData: {name: string, id: string}[],
		schoolsData: {name: string, id: string}[], eventType: string, isTeamFromActiveSchoolCricket: boolean, isMatchAwarded: boolean, activeSchoolId: string) {
		switch(eventType){
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']: 					//for inter schools cricket we show only school name
				if (isMatchAwarded && !isTeamFromActiveSchoolCricket) {
					const schoolsDataFiltered = schoolsData.filter(school => school.id === activeSchoolId);
					return schoolsDataFiltered[0].name;
				} else {
					const schoolsDataFiltered = schoolsData.filter(school => school.id === teamId);
					if (schoolsDataFiltered.length !== 0) {
						return schoolsDataFiltered[0].name;
					} else if (teamsData.length !== 0) {
						teamsData = teamsData.filter(team => team.id === teamId);
						schoolsData = schoolsData.filter(school => school.id === teamsData[0].schoolId);
						return schoolsData[0].name;
					} else {
						return 'No school name';
					}
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				teamsData = teamsData.filter(team => team.id === teamId);
				if (teamsData.length !== 0) {
					return teamsData[0].name;
				} else {
					return 'No team name';
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				housesData = housesData.filter(house => house.id === teamId);
				if (housesData.length !== 0) {
					return housesData[0].name;
				} else if (teamsData.length !== 0) {
					teamsData = teamsData.filter(team => team.id === teamId);
					return teamsData[0].name;
				} else {
					return 'No house name';
				}
			default:
				console.error(`Error: Event type - ${eventType}`);
				return '';
		}
	}

	//We get the difference module of the runs, because we only care about this, then we display text result of game
	getRuns (scores: Score[]){
		if (scores.length !== 0) {
			return Math.abs(Math.floor(scores[0].score) - Math.floor(scores[1].score));
		} else {
			return 0;
		}
	}

	//We get wickets from team score, as (10 - wickets winner team)
	getWickets (scores: Score[], teamId: string, eventType: string){
		switch (eventType){
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if (scores.findIndex(score => score.schoolId === teamId) === -1) {
					scores = scores.filter(score => score.teamId === teamId);
				} else {
					scores = scores.filter(score => score.schoolId === teamId);
				}
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				scores = scores.filter(score => score.teamId === teamId);
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				if (scores.findIndex(score => score.houseId === teamId) === -1) {
					scores = scores.filter(score => score.teamId === teamId);
				} else {
					scores = scores.filter(score => score.houseId === teamId);
				}
				break;
		}

		if (scores.length !== 0) {
			return CRICKET_WICKETS - (Math.round(scores[0].score * 10) % 10);
		} else {
			return 0;
		}
	}

	getScoreForCricket (eventType: string, teamScore: Score[], houseScore: Score[], schoolScore: Score[]) {
		let score = [];
		switch (eventType){
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if (teamScore.length === 0) { 					//school vs school
					return schoolScore;
				} else if (teamScore.length === 1) { 			//school vs team[school]
					score.push(teamScore[0], schoolScore[0]);
					return score;
				} else {										//team[school] vs team[school]
					return teamScore;
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				if (teamScore.length === 0) {					//house vs house
					return houseScore;
				} else if (teamScore.length === 1) { 			//house vs team[house]
					score.push(teamScore[0], houseScore[0]);
					return score;
				} else {										//team[house] vs team[house]
					return teamScore;
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				return teamScore; 								//team vs team
		}
	}


	_getTextResult (event: Event, activeSchoolId: string, activeSchoolKind: string) {
		if (!this.isFinished && event.sport.multiparty) {
			return 'No result yet';
		}

		if (this.isFinished && event.sport.multiparty && event.inviterSchool.id === activeSchoolId
			&& event.inviterSchool.kind === 'SchoolUnion') {
			return 'View results';
		}

		// Cricket
		if (this.isFinished && SportHelper.isCricket(event.sport.name)) { //то это полная жопа
			const teamId = typeof event.results.cricketResult !== 'undefined' ? event.results.cricketResult.who : undefined,
				result = typeof event.results.cricketResult !== 'undefined' ? event.results.cricketResult.result.toLowerCase() : undefined,
				teamsData = typeof event.teamsData !== 'undefined' ? event.teamsData : [],
				eventType = typeof event.eventType !== 'undefined' ? event.eventType : '',
				teamScore = typeof event.results.teamScore !== 'undefined' ? event.results.teamScore : [],
				houseScore = typeof event.results.houseScore !== 'undefined' ? event.results.houseScore : [],
				schoolScore = typeof event.results.schoolScore !== 'undefined' ? event.results.schoolScore : [],
				scores = this.getScoreForCricket(eventType, teamScore, houseScore, schoolScore),
				schoolsData = TeamHelper.getSchoolsData(event),
				housesData = typeof event.housesData !== 'undefined' ? event.housesData : [],
				lostInResults = event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] ? 'Lost, ' : '', //for school union site we don't need in word 'Lost'
				isMatchAwarded = result === 'match_awarded',
				isTeamFromActiveSchoolCricket = this.isTeamFromActiveSchoolCricket(teamId, activeSchoolId, teamsData, schoolsData),
				teamName = typeof teamId !== 'undefined' ? this.getTeamNameCricket(teamId, teamsData, housesData, schoolsData, eventType, isTeamFromActiveSchoolCricket, isMatchAwarded, activeSchoolId) : '',
				runsAbs = this.getRuns(scores),
				wickets = this.getWickets(scores, teamId, eventType);

			switch (true) {
				case result === 'tbd':
					return result.toUpperCase();
				case result === 'tie':
					return 'Tie';
				case result === 'draw':
					return 'Draw';
				case result === 'no_result':
					return `No result`;
				case result === 'won_by_runs' && isTeamFromActiveSchoolCricket:
					return `${teamName} won by ${runsAbs} runs`;
				case result === 'won_by_wickets' && isTeamFromActiveSchoolCricket:
					return `${teamName} won by ${wickets} wickets`;
				case result === 'won_by_innings_and_runs' && isTeamFromActiveSchoolCricket:
					return `${teamName} won by an innings and ${runsAbs} runs`;
				case result === 'won_by_runs' && !isTeamFromActiveSchoolCricket:
					return `${lostInResults}${teamName} won by ${runsAbs} runs`;
				case result === 'won_by_wickets' && !isTeamFromActiveSchoolCricket:
					return `${lostInResults} ${teamName} won by ${wickets} wickets`;
				case result === 'won_by_innings_and_runs' && !isTeamFromActiveSchoolCricket:
					return `${lostInResults}${teamName} won by an innings and ${runsAbs} runs`;
				case result === 'match_awarded' && isTeamFromActiveSchoolCricket:
					return `Match awarded to ${teamName}`;
				case result === 'match_awarded' && !isTeamFromActiveSchoolCricket:
					return `Match conceded by ${teamName}`;
				default:
					return `No result yet`;
			}
		}

		if (!this.isFinished && SportHelper.isCricket(event.sport.name)) {
			return `No result yet`;
		}

		if (this.isFinished && TeamHelper.isInterSchoolsEventForTeamSport(event) && event.sport.multiparty &&
			activeSchoolId !== '' && //for school union public site activeSchoolId maybe ''
			activeSchoolId !== null &&  //for parent activeSchoolId maybe null
			event.teamsData.length !== 2) {
			const places = ChallengeModelHelper.getSortedPlaceArrayForInterSchoolsMultipartyTeamEvent(event);

			if (places.length === 1) {
				return 'Draw';
			} else {
				const activeSchoolPlace = places.find(p => {
					return p.schoolIds.find(id => id === activeSchoolId);
				});

				if (typeof activeSchoolPlace !== 'undefined') {
					const numberOfPlayers = event.invitedSchoolIds.length + 1;

					return `Place ${activeSchoolPlace.place} of ${numberOfPlayers}`;
				} else {
					if (activeSchoolKind === 'SchoolUnion') {
						return 'Multiple result';
					} else {
						console.error('ERROR: Cannot find active school in places array.');

						return '';
					}
				}
			}
		}

		if (this.isFinished && !TeamHelper.isInterSchoolsEventForTeamSport(event) &&
			TeamHelper.isTeamSport(event) && event.sport.multiparty && event.teamsData.length !== 2) {
			return 'Multiple result'
		}

		if (this.isFinished && !this.isIndividualSport && event.eventType === "EXTERNAL_SCHOOLS" &&
			!(event.inviterSchool.kind === 'SchoolUnion') && !SportHelper.isCricket(event.sport.name)) {
			const scoreArray = this.scoreAr;

			switch (event.sport.scoring) {
				case 'LESS_SCORES':
				case 'LESS_TIME':
				case 'LESS_RESULT':
					if (scoreArray[0] < scoreArray[1]) {
						return "Won";
					} else if (scoreArray[0] > scoreArray[1]) {
						return "Lost";
					} else {
						return "Draw";
					}
				case 'MORE_SCORES':
				case 'MORE_TIME':
				case 'MORE_RESULT':
				case 'FIRST_TO_N_POINTS':
					if (scoreArray[0] > scoreArray[1]) {
						return "Won";
					} else if (scoreArray[0] < scoreArray[1]) {
						return "Lost";
					} else {
						return "Draw";
					}
			}
		}

		if (this.isFinished && TeamHelper.isNonTeamSport(event)) {
			return 'View results';
		}
	}
}