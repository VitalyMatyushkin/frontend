/**
 * Created by Woland on 25.04.2017.
 */
const React = require('react');

const 	EventHelper = require('module/helpers/eventHelper'),
		TeamHelper  = require('module/ui/managers/helpers/team_helper');

const CRICKET_WICKETS = 10;

const CricketResultBlockStyles = require('styles/ui/cricket_result_block/cricket_result_block.scss');

const CricketResultBlock = React.createClass({
	propTypes: {
		event: 				React.PropTypes.object.isRequired,
		activeSchoolId: 	React.PropTypes.string.isRequired
	},
	
	isTeamFromActiveSchoolCricket: function(teamId, activeSchoolId, teamsData){
		teamsData = teamsData.filter(team => team.schoolId === activeSchoolId);
		if (teamsData.length === 0) { 			//if teamsData.length === 0, we are on the public school union site
			return true; 						// for public school union site we set flag isTeamFromActiveSchoolCricket in true
		} else if (teamsData.length === 1) { 	//for EXTERNAL_SCHOOLS matches only 1 team may be from active school
			return teamId === teamsData[0].id;
		} else { 								//for INTERNAL_TEAMS and INTERNAL_HOUSES matches 2 teams may be from active school
			return true; 						//for INTERNAL_TEAMS and INTERNAL_HOUSES we set flag isTeamFromActiveSchoolCricket in true
		}
	},

	getTeamNameCricket: function(teamId, teamsData, housesData, schoolsData, eventType, isTeamFromActiveSchoolCricket, isMatchAwarded){
		switch(eventType){
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']: 	//for inter schools cricket we show only school name
				if (isMatchAwarded && !isTeamFromActiveSchoolCricket) {						//for case "match awarded" we need in our school name and school name of rival,
					schoolsData = schoolsData.filter(school => school.id === teamId); 		//because we have only teamId and result in cricket result
					if (schoolsData.length !== 0) {
						return schoolsData[0].name;
					} else {
						teamsData = teamsData.filter(team => team.id !== teamId);
						schoolsData = schoolsData.filter(school => school.id === teamsData[0].schoolId);
						return schoolsData[0].name;
					}
				} else {
					schoolsData = schoolsData.filter(school => school.id === teamId);
					if (schoolsData.length !== 0) {
						return schoolsData[0].name;
					} else if (teamsData.length !== 0) {
						teamsData = teamsData.filter(team => team.id === teamId);
						return teamsData[0].name;
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
				return 'undefined';
		}
	},

	//We get the difference module of the runs, because we only care about this, then we display text result of game
	getRuns: function(scores){
		if (scores.length !== 0) {
			return Math.abs(Math.floor(scores[0].score) - Math.floor(scores[1].score));
		} else {
			return 0;
		}
	},
	
	//We get wickets from team score, as (10 - wickets winner team)
	getWickets: function(scores, teamId, eventType){
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
	},
	
	getScoreForCricket: function(eventType, teamScore, houseScore, schoolScore){
		switch (eventType){
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if (teamScore.length === 0) {
					return schoolScore;
				} else {
					return teamScore;
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				if (teamScore.length === 0) {
					return houseScore;
				} else {
					return teamScore;
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				return teamScore;
		}
	},
	
	getTextResult: function(){
		const 	event 							= this.props.event,
				teamId 							= typeof event.results.cricketResult !== 'undefined' ? event.results.cricketResult.who : undefined,
				result 							= typeof event.results.cricketResult !== 'undefined' ? event.results.cricketResult.result.toLowerCase() : undefined,
				teamsData 						= typeof event.teamsData !== 'undefined' ? event.teamsData : [],
				eventType 						= typeof event.eventType !== 'undefined' ? event.eventType : '',
				teamScore 						= typeof event.results.teamScore !== 'undefined' ? event.results.teamScore : [],
				houseScore 						= typeof event.results.houseScore !== 'undefined' ? event.results.houseScore : [],
				schoolScore 					= typeof event.results.schoolScore !== 'undefined' ? event.results.schoolScore : [],
				scores 							= this.getScoreForCricket(eventType, teamScore, houseScore, schoolScore),
				schoolsData						= TeamHelper.getSchoolsData(event),
				housesData						= typeof event.housesData !== 'undefined' ? event.housesData : [],
				lostInResults 					= event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] ? 'Lost, ' : '', //for school union site we don't need in word 'Lost'
				isMatchAwarded 					= result === 'match_awarded',
				isTeamFromActiveSchoolCricket 	= this.isTeamFromActiveSchoolCricket(teamId, this.props.activeSchoolId, teamsData),
				teamName 						= typeof teamId !=='undefined' ? this.getTeamNameCricket(teamId, teamsData, housesData, schoolsData, eventType, isTeamFromActiveSchoolCricket, isMatchAwarded) : '',
				runsAbs 						= this.getRuns(scores),
				wickets		 					= this.getWickets(scores, teamId, eventType);
		
		switch (true) {
			case result === 'tie' || result === 'draw' || result === 'tbd':
				return result.toUpperCase();
			case result === 'no_result':
				return `No result`;
			case result === 'won_by_runs' && isTeamFromActiveSchoolCricket:
				return `${teamName} won by ${runsAbs} runs`;
			case result === 'won_by_wickets' && isTeamFromActiveSchoolCricket:
				return `${teamName} won by ${wickets} wickets`;
			case result === 'won_by_innings_and_runs' && isTeamFromActiveSchoolCricket:
				return `${teamName} won by innings and ${runsAbs} runs`;
			case result === 'won_by_runs' && !isTeamFromActiveSchoolCricket:
				return `${lostInResults}${teamName} won by ${runsAbs} runs`;
			case result === 'won_by_wickets' && !isTeamFromActiveSchoolCricket:
				return `${lostInResults} ${teamName} won by ${wickets} wickets`;
			case result === 'won_by_innings_and_runs' && !isTeamFromActiveSchoolCricket:
				return `${lostInResults}${teamName} won by innings and ${runsAbs} runs`;
			case result === 'match_awarded' && isTeamFromActiveSchoolCricket:
				return `Match awarded to ${teamName}`;
			case result === 'match_awarded' && !isTeamFromActiveSchoolCricket:
				return `Match conceded by ${teamName}`;
			default:
				return `No result yet`;
		}
	},
	
	render: function(){
		return (
			<div className="eCricketResultBlock">
				{ this.getTextResult() }
			</div>
		);
	}
});

module.exports = CricketResultBlock;