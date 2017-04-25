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
		return {
			leftTeamId: event.results.teamScore["0"].teamId,
			rightTeamId: event.results.teamScore["1"].teamId
		}
	},
	
	getPointsForCricket: function(event) {
		let points = [];
		
		points.push(Math.round(event.results.teamScore["0"].score * 10) / 10);
		points.push(Math.round(event.results.teamScore["1"].score * 10) / 10);

		return points;
	},
	
	getRivalName: function(teamId){
		const 	eventType = this.props.event.eventType,
				order = this.props.event.teamsData.findIndex(team => team.id === teamId);
		
		if (EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] === eventType) {
			return `${this.props.event.schoolsData[order].name} ${this.props.event.teamsData[order].name}`
		} else {
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