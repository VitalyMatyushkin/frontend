/**
 * Created by Woland on 19.04.2017.
 */
const 	React 				= require('react'),
		SelectForCricket 	= require('./select_for_cricket');

const 	EventHelper 		= require('module/helpers/eventHelper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper');

const 	RESULTS_FOR_CRICKET_WON_BY_RUNS 			= 'Won_by_runs',
		RESULTS_FOR_CRICKET_WON_BY_WICKETS 			= 'Won_by_wickets',
		RESULTS_FOR_CRICKET_WON_BY_INNINGS_AND_RUNS = 'Won_by_innings_and_runs',
		RESULTS_FOR_CRICKET_MATCH_AWARDED 			= 'Match_awarded',
		RESULTS_FOR_CRICKET_FOR_SELECT_TBD 			= ['TBD'],
		RESULTS_FOR_CRICKET_FOR_SELECT_TIE 			= ['Tie'],
		RESULTS_FOR_CRICKET_FOR_SELECT_DRAW 		= ['Draw'],
		RESULTS_FOR_CRICKET_FOR_SELECT_NO_RESULT 	= [{
			string: 'No result',
			value: 'No_result'
		}];

const CRICKET_WICKETS = 10;

/**
 * Calculates all possible options for cricket event based on provided scores
 */

const SelectForCricketWrapper = React.createClass({
	propTypes: {
		event: 				React.PropTypes.object,
		onChangeResult: 	React.PropTypes.func.isRequired
	},
	
	getInitialState: function(){
		return {
			results: []
		};
	},

	componentWillReceiveProps: function(nextProps){
		if (nextProps.event !== this.props.event) {
			let stateArray = [];

			stateArray = stateArray.concat(
				RESULTS_FOR_CRICKET_FOR_SELECT_TBD,
				this.addTeamResultsInGameResultsMenu(nextProps.event),
				RESULTS_FOR_CRICKET_FOR_SELECT_NO_RESULT,
				RESULTS_FOR_CRICKET_FOR_SELECT_TIE,
				RESULTS_FOR_CRICKET_FOR_SELECT_DRAW,
				this.addMatchAwardedInGameResultMenu(nextProps.event)
			);

			this.setState({results: stateArray});
		}
	},
	
	addMatchAwardedInGameResultMenu: function(event){
		let matchAwardedArray = [];
		const 	leftTeamId 			= this.getTeamsIdOrderByResults(event).leftTeamId,
				rightTeamId 		= this.getTeamsIdOrderByResults(event).rightTeamId;

		matchAwardedArray.push({
			string: `Match awarded to ${this.getRivalName(leftTeamId)}`,
			value: RESULTS_FOR_CRICKET_MATCH_AWARDED,
			teamId: leftTeamId
		});
		matchAwardedArray.push({
			string: `Match awarded to ${this.getRivalName(rightTeamId)}`,
			value: RESULTS_FOR_CRICKET_MATCH_AWARDED,
			teamId: rightTeamId
		});
		
		return matchAwardedArray;
	},
	
	addTeamResultsInGameResultsMenu: function(event){
		let teamResultsArray = [];
		const 	points 				= this.getPointsForCricket(event),
				leftTeamId 			= this.getTeamsIdOrderByResults(event).leftTeamId,
				rightTeamId 		= this.getTeamsIdOrderByResults(event).rightTeamId,
				pointsForLeftTeam 	= TeamHelper.convertPointsCricket(points[0]),
				pointsForRightTeam 	= TeamHelper.convertPointsCricket(points[1]),
				runsForLeftTeam 	= pointsForLeftTeam.runs,
				wicketsForLeftTeam 	= pointsForLeftTeam.wickets,
				runsForRightTeam 	= pointsForRightTeam.runs,
				wicketsForRightTeam = pointsForRightTeam.wickets;
		

			if (runsForLeftTeam - runsForRightTeam > 0) {
				
				teamResultsArray.push({
					string: `${this.getRivalName(leftTeamId)} won by ${runsForLeftTeam - runsForRightTeam} runs`,
					value: RESULTS_FOR_CRICKET_WON_BY_RUNS,
					teamId: leftTeamId
				});

				teamResultsArray.push({
					string: `${this.getRivalName(leftTeamId)} won by ${CRICKET_WICKETS - wicketsForLeftTeam} wickets`,
					value: RESULTS_FOR_CRICKET_WON_BY_WICKETS,
					teamId: leftTeamId
				});
				
				teamResultsArray.push({
					string: `${this.getRivalName(leftTeamId)} won by an innings and ${runsForLeftTeam - runsForRightTeam} runs`,
					value: RESULTS_FOR_CRICKET_WON_BY_INNINGS_AND_RUNS,
					teamId: leftTeamId
				});
			}

			if (runsForLeftTeam - runsForRightTeam < 0) {
				
				teamResultsArray.push({
					string: `${this.getRivalName(rightTeamId)} won by ${runsForRightTeam - runsForLeftTeam} runs`,
					value: RESULTS_FOR_CRICKET_WON_BY_RUNS,
					teamId: rightTeamId
				});
				
				teamResultsArray.push({
					string: `${this.getRivalName(rightTeamId)} won by ${CRICKET_WICKETS - wicketsForRightTeam} wickets`,
					value: RESULTS_FOR_CRICKET_WON_BY_WICKETS,
					teamId: rightTeamId
				});
				
				teamResultsArray.push({
					string: `${this.getRivalName(rightTeamId)} won by an innings and ${runsForRightTeam - runsForLeftTeam} runs`,
					value: RESULTS_FOR_CRICKET_WON_BY_INNINGS_AND_RUNS,
					teamId: rightTeamId
				});
			}
		
		return teamResultsArray;
	},
	
	componentDidMount: function(){
		let stateArray = [];

		stateArray = stateArray.concat(
			RESULTS_FOR_CRICKET_FOR_SELECT_TBD,
			this.addTeamResultsInGameResultsMenu(this.props.event),
			RESULTS_FOR_CRICKET_FOR_SELECT_NO_RESULT,
			RESULTS_FOR_CRICKET_FOR_SELECT_TIE,
			RESULTS_FOR_CRICKET_FOR_SELECT_DRAW,
			this.addMatchAwardedInGameResultMenu(this.props.event)
		);
		
		this.setState({results: stateArray});
	},
	
	getTeamsIdOrderByResults: function(event){
		const 	eventType 	= event.eventType,
				teamScore 	= typeof event.results.teamScore !== 'undefined' ? event.results.teamScore : [],
				houseScore 	= typeof event.results.houseScore !== 'undefined' ? event.results.houseScore : [],
				schoolScore = typeof event.results.schoolScore !== 'undefined' ? event.results.schoolScore : [],
				scores 		= this.getScoreForCricket(eventType, teamScore, houseScore, schoolScore);
		
		let order;
		
		switch(eventType){
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if (teamScore.length === 1) {
					return {
						leftTeamId: scores['0'].teamId,
						rightTeamId: scores['1'].schoolId
					};
				} else if (teamScore.length > 1) {
					return {
						leftTeamId: scores['0'].teamId,
						rightTeamId: scores['1'].teamId
					};
				} else {
					return {
						leftTeamId: scores['0'].schoolId,
						rightTeamId: scores['1'].schoolId
					};
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				if (teamScore.length === 1) {
					return {
						leftTeamId: scores['0'].teamId,
						rightTeamId: scores['1'].houseId
					};
				} else if (teamScore.length > 1) {
					return {
						leftTeamId: scores['0'].teamId,
						rightTeamId: scores['1'].teamId
					};
				} else {
					return {
						leftTeamId: scores['0'].houseId,
						rightTeamId: scores['1'].houseId
					};
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				return {
					leftTeamId: scores['0'].teamId,
					rightTeamId: scores['1'].teamId
				};
		}

	},
	
	getScoreForCricket: function(eventType, teamScore, houseScore, schoolScore){
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
	},
	
	getPointsForCricket: function(event) {
		let points = [];
		
		const 	eventType 	= event.eventType,
				teamScore 	= typeof event.results.teamScore !== 'undefined' ? event.results.teamScore : [],
				houseScore 	= typeof event.results.houseScore !== 'undefined' ? event.results.houseScore : [],
				schoolScore = typeof event.results.schoolScore !== 'undefined' ? event.results.schoolScore : [],
				scores 		= this.getScoreForCricket(eventType, teamScore, houseScore, schoolScore);
		
		points.push(Math.round(scores["0"].score * 10) / 10);
		points.push(Math.round(scores["1"].score * 10) / 10);

		return points;
	},
	
	getRivalName: function(teamId){
		const eventType = this.props.event.eventType;
		
		let order, teamName;

		switch(eventType){
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if (this.props.event.teamsData.length === 1) {									// school vs team[school]
					order = this.props.event.teamsData.findIndex(team => team.id === teamId);
					
					if (order === -1) {
						teamName = this.props.event.schoolsData.find(school => school.id === teamId).name;
					} else {
						teamName = this.props.event.teamsData[order].name;
					}
					
					return `${teamName}`
				} else if (this.props.event.teamsData.length > 1) { 							//team[school] vs team[school]
					order = this.props.event.teamsData.findIndex(team => team.id === teamId);
					
					teamName = this.props.event.schoolsData.find(school => school.id === this.props.event.teamsData[order].schoolId).name;
					return `${teamName} ${this.props.event.teamsData[order].name}`
				} else {																		//school vs school
					order = this.props.event.schoolsData.findIndex(school => school.id === teamId);
					return `${this.props.event.schoolsData[order].name}`
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				if (this.props.event.teamsData.length === 1) { 									//house vs team[house]
					order = this.props.event.teamsData.findIndex(team => team.id === teamId);
					
					if (order === -1) {
						teamName = this.props.event.housesData.find(house => house.id === teamId).name;
					} else {
						teamName = this.props.event.teamsData[order].name;
					}
					
					return `${teamName}`
				} else if (this.props.event.teamsData.length > 1) { 							//team[house] vs team[house]
					order = this.props.event.teamsData.findIndex(team => team.id === teamId);
					
					teamName = this.props.event.housesData.find(house => house.id === this.props.event.teamsData[order].houseId).name;
					
					return `${teamName} ${this.props.event.teamsData[order].name}`
				} else {																		//house vs house
					order = this.props.event.housesData.findIndex(house => house.id === teamId);
					return `${this.props.event.housesData[order].name}`
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				order = this.props.event.teamsData.findIndex(team => team.id === teamId);
				return `${this.props.event.teamsData[order].name}`
		}
	},
	onChangeResult: function(value){
		let resultObject;
		if (value.indexOf('/') !== -1) {
			const resultArray = value.split('/');
			resultObject = {
				who: resultArray[1],
				result: resultArray[0]
			};
		} else {
			resultObject = {
				result: value
			};
		}
		this.props.onChangeResult(resultObject);
	},
	getActiveResult: function(){
		
		const 	teamId = typeof this.props.event.results.cricketResult !== 'undefined' ? this.props.event.results.cricketResult.who : undefined,
				result = typeof this.props.event.results.cricketResult !== 'undefined' ? this.props.event.results.cricketResult.result.toLowerCase() : undefined;
		
		if (typeof teamId === 'undefined' && typeof result === 'undefined') {
			return RESULTS_FOR_CRICKET_FOR_SELECT_TBD[0].toLowerCase();
		} else if (typeof teamId === 'undefined' && typeof result !== 'undefined') {
			return result;
		} else {
			return `${result}/${teamId}`
		}
	},
	
	render: function(){
		return (
			<SelectForCricket
				results 		= { this.state.results }
				activeResult 	= { this.getActiveResult() }
				onChangeResult 	= { this.onChangeResult }
			/>
		);
	}
});

module.exports = SelectForCricketWrapper;