/**
 * Created by Woland on 25.04.2017.
 */
const React = require('react');

const 	EventHelper = require('module/helpers/eventHelper'),
		TeamHelper  = require('module/ui/managers/helpers/team_helper');

const CRICKET_WICKETS = 10;

const DivForCricketWithResultStyles = require('styles/ui/div_for_cricket_with_result/div_for_cricket_with_result.scss');

const DivForCricketWithResult = React.createClass({
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

	getTeamNameCricket: function(teamId, teamsData, eventType, schoolsData, isTeamFromActiveSchoolCricket, isMatchAwarded){
		switch(true){
			case eventType === 'EXTERNAL_SCHOOLS':
				if (isMatchAwarded && !isTeamFromActiveSchoolCricket) {//for case "match awarded" we need in our school name and school name of rival, because we have only teamId and result in cricket result
					teamsData = teamsData.filter(team => team.id !== teamId);
					schoolsData = schoolsData.filter(school => school.id === teamsData[0].schoolId);
					return schoolsData[0].name;
				} else {
					teamsData = teamsData.filter(team => team.id === teamId);
					if (teamsData.length !== 0) {
						schoolsData = schoolsData.filter(school => school.id === teamsData[0].schoolId);
						return schoolsData[0].name;
					} else {
						return 'No school name';
					}
				}
			case eventType === 'INTERNAL_TEAMS':
				teamsData = teamsData.filter(team => team.id === teamId);
				if (teamsData.length !== 0) {
					return teamsData[0].name;
				} else {
					return 'No team name'
				}
			case eventType === 'INTERNAL_HOUSES':
				teamsData = teamsData.filter(team => team.id === teamId);
				if (teamsData.length !== 0) {
					return teamsData[0].name;
				} else {
					return 'No team name'
				}
			default:
				return 'undefined'
		}
	},

	//We get the difference module of the runs, because we only care about this, then we display text result of game
	getRuns: function(teamsScore){
		if (teamsScore.length !== 0) {
			return Math.abs(Math.floor(teamsScore[0].score) - Math.floor(teamsScore[1].score));
		} else {
			return 0;
		}
	},
	
	//We get wickets from team score, as (10 - wickets winner team)
	getWickets: function(teamsScore, teamId){
		teamsScore = teamsScore.filter(team => team.teamId === teamId);
		if (teamsScore.length !== 0) {
			return CRICKET_WICKETS - (Math.round(teamsScore[0].score * 10) % 10);
		} else {
			return 0;
		}
	},
	
	
	getTextResult: function(){
		const 	event 							= this.props.event,
				activeSchoolId 					= this.props.activeSchoolId,
				teamId 							= typeof event.results.cricketResult !== 'undefined' ? event.results.cricketResult.who : undefined,
				result 							= typeof event.results.cricketResult !== 'undefined' ? event.results.cricketResult.result.toLowerCase() : undefined,
				teamsData 						= event.teamsData,
				teamsScore 						= event.results.teamScore,
				schoolsData						= TeamHelper.getSchoolsData(event),
				eventType 						= event.eventType,
				lostInResults 					= event.eventType === 'EXTERNAL_SCHOOLS' ? 'Lost, ' : '',
				isMatchAwarded 					= result === 'match_awarded',
				isTeamFromActiveSchoolCricket 	= this.isTeamFromActiveSchoolCricket(teamId, activeSchoolId, teamsData),
				teamName 						= this.getTeamNameCricket(teamId, teamsData, eventType, schoolsData, isTeamFromActiveSchoolCricket, isMatchAwarded),
				runsAbs 						= this.getRuns(teamsScore),
				wickets		 					= this.getWickets(teamsScore, teamId);
		
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
			<div className="eDivForCricketWithResult">
				{ this.getTextResult() }
			</div>
		);
	}
});

module.exports = DivForCricketWithResult;