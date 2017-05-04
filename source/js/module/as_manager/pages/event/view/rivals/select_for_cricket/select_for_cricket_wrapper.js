/**
 * Created by Woland on 19.04.2017.
 */
const 	React 				= require('react'),
		propz 				= require('propz'),
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
				teamScore 	= propz.get(event, ['results', 'teamScore'], []),
				houseScore 	= propz.get(event, ['results', 'houseScore'], []),
				schoolScore = propz.get(event, ['results', 'schoolScore'], []),
				scores 		= this.getScoreForCricket(eventType, teamScore, houseScore, schoolScore);

		return {
			leftTeamId: scores['0'].teamId,
			rightTeamId: scores['1'].teamId
		};

	},
	
	getScoreForCricket: function(eventType, teamScore, houseScore, schoolScore){
		let score = [];
		
		const 	event 			= this.props.event,
				schoolsData 	= propz.get(event, ['schoolsData']),
				housesData 		= propz.get(event, ['housesData']),
				teamsData 		= propz.get(event, ['teamsData']);

		switch (eventType){
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if (teamScore.length === 0) {
					if (schoolScore.length === 0) {
						score.push({
							score: 0,
							teamId: schoolsData["0"].id
						}, {
							score: 0,
							teamId: schoolsData["1"].id
						});
						return score;
					} else if (schoolScore.length === 1) {
						const rivalWithoutScore = schoolsData.filter(school => school.id !== schoolScore[0].teamId);
						score.push({
							score: schoolScore[0].score,
							teamId: schoolScore[0].schoolId
						}, {
							teamId: rivalWithoutScore[0].id,
							score: 0
						});
						return score;
					} else {
						score.push({
							score: schoolScore["0"].score,
							teamId: schoolScore["0"].schoolId
						}, {
							score: schoolScore["1"].score,
							teamId: schoolScore["1"].schoolId
						});
						return score;
					}
				} else if (teamScore.length === 1) {
					if (schoolScore.length === 0) {
						const rivalWithoutScore = schoolsData.filter(school => school.id !== teamScore[0].teamId);
						score.push(teamScore[0], {
							teamId: rivalWithoutScore[0].id,
							score: 0
						});
						
						return score;
					} else {
						score.push(teamScore[0], {
							score: schoolScore[0].score,
							teamId: schoolScore[0].schoolId
						});
						return score;
					}
				} else {
					return teamScore;
				}

			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				if (teamScore.length === 0) {					//house vs house
					if (houseScore.length === 0) {
						score.push({
							score: 0,
							teamId: housesData["0"].id
						}, {
							score: 0,
							teamId: housesData["1"].id
						});
						return score;
					} else if (houseScore.length === 1) {
						const rivalWithoutScore = housesData.filter(house => house.id !== houseScore[0].teamId);
						score.push({
							score: houseScore[0].score,
							teamId: houseScore[0].houseId
						}, {
							teamId: rivalWithoutScore[0].id,
							score: 0
						});
						return score;
					} else {
						score.push({
							score: houseScore["0"].score,
							teamId: houseScore["0"].houseId
						}, {
							score: houseScore["1"].score,
							teamId: houseScore["1"].houseId
						});
						return score;
					}
				} else if (teamScore.length === 1) {
					if (houseScore.length === 0) {
						const rivalWithoutScore = housesData.filter(house => house.id !== teamScore[0].teamId);
						score.push(teamScore[0], {
							teamId: rivalWithoutScore[0].id,
							score: 0
						});
						
						return score;
					} else {
						score.push(teamScore[0], {
							score: houseScore[0].score,
							teamId: houseScore[0].houseId
						});
						return score;
					}
				} else {
					return teamScore;
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				if (teamScore.length === 0) {
					score.push({
						score: 0,
						teamId: teamsData["0"].id
					}, {
						score: 0,
						teamId: teamsData["1"].id
					});
					return score;
				} else if (teamScore.length === 1) {
					const rivalWithoutScore = teamsData.filter(team => team.id !== teamScore[0].teamId);
					score.push(teamScore[0], {
						teamId: rivalWithoutScore[0].id,
						score: 0
					});
					return score;
				} else {
					return teamScore;
				}
		}
	},
	
	getPointsForCricket: function(event) {
		let points = [];
		
		const 	eventType 	= event.eventType,
				teamScore 	= propz.get(event, ['results', 'teamScore'], []),
				houseScore 	= propz.get(event, ['results', 'houseScore'], []),
				schoolScore = propz.get(event, ['results', 'schoolScore'], []),
				scores 		= this.getScoreForCricket(eventType, teamScore, houseScore, schoolScore);

		if (typeof scores === 'undefined') {
			points.push(0, 0);
		} else if (scores.length === 1) {
			points.push(scores['0'].score, 0);
		} else {
			points.push(scores['0'].score, scores['1'].score);
		}
		
		return [Math.round(points["0"] * 10) / 10, Math.round(points["1"] * 10) / 10];
	},
	
	getRivalName: function(teamId){
		const 	eventType = this.props.event.eventType,
				event 			= this.props.event,
				schoolsData 	= propz.get(event, ['schoolsData']),
				housesData 		= propz.get(event, ['housesData']),
				teamsData 		= propz.get(event, ['teamsData']);
		
		let order, teamName;

		switch(eventType){
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if (teamsData.length === 1) {
					order = teamsData.findIndex(team => team.id === teamId);
					
					if (order === -1) {
						teamName = schoolsData.find(school => school.id === teamId).name;
					} else {
						teamName = teamsData[order].name;
					}
					
					return `${teamName}`
				} else if (teamsData.length > 1) {
					order = teamsData.findIndex(team => team.schoolId === teamId);
					
					if (order === -1) {
						order = teamsData.findIndex(team => team.id === teamId);
					}
					
					teamName = schoolsData.find(school => school.id === teamsData[order].schoolId).name;
					return `${teamName} ${teamsData[order].name}`
				} else {
					order = schoolsData.findIndex(school => school.id === teamId);
					return `${schoolsData[order].name}`
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				if (teamsData.length === 1) {
					order = teamsData.findIndex(team => team.id === teamId);
					
					if (order === -1) {
						teamName = housesData.find(house => house.id === teamId).name;
					} else {
						teamName = teamsData[order].name;
					}
					
					return `${teamName}`
				} else if (teamsData.length > 1) {
					order = teamsData.findIndex(team => team.houseId === teamId);
					if (order === -1) {
						order = teamsData.findIndex(team => team.id === teamId);
					}
					
					teamName = housesData.find(house => house.id === teamsData[order].houseId).name;
					
					return `${teamName} ${teamsData[order].name}`
				} else {
					order = housesData.findIndex(house => house.id === teamId);
					return `${housesData[order].name}`
				}
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				order = teamsData.findIndex(team => team.id === teamId);
				return `${teamsData[order].name}`
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
		const	event = this.props.event,
				teamId = propz.get(event, ['results', 'cricketResult', 'who']),
				result = propz.get(event, ['results', 'cricketResult', 'result']);
		
		if (typeof teamId === 'undefined' && typeof result === 'undefined') {
			return RESULTS_FOR_CRICKET_FOR_SELECT_TBD[0].toLowerCase();
		} else if (typeof teamId === 'undefined' && typeof result !== 'undefined') {
			return result.toLowerCase();
		} else {
			return `${result.toLowerCase()}/${teamId}`
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